/* eslint-disable @typescript-eslint/no-unused-vars */
"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

import { nextGetServerSession } from "@/lib/next-auth";
import prisma from "@/lib/prisma";
import { FormWithFields } from "@/types/entityRelations";
import { findForm, findFormWithSubmission } from "@/utils/database/form.query";
import generateRandomSlug from "@/utils/randomSlug";

import { deleteFormById } from "./";

export const deleteForm = async (form_id: string) => {
  try {
    await deleteFormById(form_id);
    revalidatePath("/admin/form");
    revalidatePath(`/admin/form/${form_id}`);
    revalidatePath(`/form/${form_id}`);
    return { error: false, message: "Sukses menghapus formulir" };
  } catch (e) {
    console.error(e);
    return { error: true, message: "Gagal menghapus formulir" };
  }
};

export const saveForm = async (
  data: FormWithFields,
  is_new = false,
  isFieldsEdited = false,
) => {
  try {
    const session = await nextGetServerSession();
    const { user } = session!;
    console.log(isFieldsEdited);
    if (!is_new) {
      const form = await findFormWithSubmission({ id: data.id });

      if (!form) return { error: false, message: "Form not found" };
      if (user?.role !== "SuperAdmin" && user?.id != form.user_id) {
        return { error: false, message: "Forbidden access" };
      }

      // reject if the form has respondents
      if (form.submissions.length && isFieldsEdited) {
        return {
          error: true,
          message: "Hapus data responden untuk mengedit formulir",
        };
      }

      // eslint-disable-next-line no-unused-vars
      const { _count, fields, ...formData } = data;
      const updateInput = formData;

      await prisma.form.update({
        where: { id: updateInput.id },
        data: { ...updateInput },
      });

      if (isFieldsEdited) {
        const fieldsToDelete = form?.fields.filter(
          (item) => data.fields.findIndex((field) => item.id == field.id) == -1,
        );

        // Delete unused fields
        await prisma.field.deleteMany({
          where: { OR: fieldsToDelete.map((item) => ({ id: item.id })) },
        });

        await Promise.all(
          fields.map(async (field, index) => {
            if (field.options.length) {
              await prisma.field_Option.deleteMany({
                where: { field_id: field.id },
              });
            }

            const newField = {
              ...field,
              fieldNumber: index + 1,
              form_id: data.id,
              options: undefined,
            };

            if (field.id === 0) {
              field.id = (
                await prisma.field.create({
                  data: { ...newField, id: undefined },
                })
              ).id;
            } else {
              await prisma.field.update({
                where: { id: newField.id },
                data: newField,
              });
            }
            const options = field.options.map((option) => {
              return { ...option, id: undefined, field_id: field.id };
            });

            await prisma.field_Option.createMany({ data: options });
          }),
        );
      }

      revalidatePath("/admin/form");
      revalidatePath(`/admin/form/${data.id}`);
      revalidatePath(`/form/${data.id}`);
      return {
        error: false,
        message: "Berhasil menyimpan formulir",
        data: { id: data.id },
      };
    } else {
      // eslint-disable-next-line no-unused-vars
      const { _count, fields, ...formData } = data;
      const createInput: Prisma.FormUncheckedCreateInput = formData;

      const createdForm = await prisma.form.create({
        data: {
          ...createInput,
          id: generateRandomSlug(),
          user_id: user?.id || "",
        },
      });

      await Promise.all(
        fields.map(async (field, index) => {
          const fieldOptions = field.options.map((option) => {
            return { ...option, field_id: undefined, id: undefined };
          });

          const newField = {
            ...field,
            fieldNumber: index + 1,
            form_id: createdForm.id,
            id: undefined,
            options: undefined,
          };

          await prisma.field.create({
            data: {
              ...newField,
              options: { createMany: { data: fieldOptions } },
            },
          });
        }),
      );

      revalidatePath("/admin/form");
      revalidatePath(`/admin/form/${data.id}`);
      revalidatePath(`/form/${data.id}`);
      return {
        error: false,
        message: "Berhasil menyimpan formulir",
        data: { id: createdForm.id },
      };
    }
  } catch (e) {
    console.error(e);
    return { error: true, message: "Gagal menyimpan formulir" };
  }
};

export const cloneForm = async (id: string) => {
  try {
    const session = await nextGetServerSession();
    const { user } = session!;

    const form = await findForm({
      id: id,
    });
    if (!form) throw new Error("Form tidak dimukan");

    const createFormInput = { ...form, _count: undefined };

    if (user?.role !== "SuperAdmin" && user?.id != form.user_id) {
      return { error: false, message: "Forbidden access" };
    }

    const newForm: Prisma.FormUncheckedCreateInput = {
      ...createFormInput,
      id: generateRandomSlug(),
      title: "Salinan " + form.title,
      created_at: new Date(),
      fields: {
        createMany: {
          data: form.fields.map((field) => {
            return {
              ...field,
              form_id: undefined,
              id: undefined,
              options: undefined,
            };
          }),
        },
      },
    };

    const createForm = await prisma.form.create({ data: newForm });
    if (!createForm) throw new Error("Terjadi kesalahan saat menyalin");

    const clonedForm = await findForm({ id: createForm.id });

    const options = form.fields
      .map((item, index) => {
        const newOptions = item.options.map((option) => ({
          ...option,
          field_id: clonedForm?.fields[index].id || 0,
          id: undefined,
        }));
        return newOptions;
      })
      .filter((item) => item.length > 0);

    await prisma.field_Option.createMany({ data: options.flat(1) });

    revalidatePath("/admin/form");
    return {
      error: false,
      message: "Berhasil membuat salian",
      data: { id: createForm.id },
    };
  } catch (e) {
    console.error(e);
    return { error: true, message: "Gagal membuat salinan" };
  }
};

export const deleteSubmission = async (id: string) => {
  try {
    await prisma.submission.deleteMany({
      where: { form_id: id },
    });

    revalidatePath("/admin/form");
    revalidatePath("/admin/form/[id]");
    revalidatePath("/form/[id]", "page");
    return { error: false, message: "Berhasil menghapus jawaban" };
  } catch (e) {
    console.error(e);
    return { error: true, message: "Berhasil menghapus jawaban" };
  }
};
