'use server';

import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import * as Sentry from '@sentry/nextjs';
import { getServerSession } from 'next-auth';
import { uuidv7 } from 'uuidv7';

import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import {
  createEventProjectSchema,
  createProjectSchema,
  deleteProjectSchema,
  updateProjectSchema
} from '@/schemas/project';

export async function createProject(formData: FormData) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return {
        success: false,
        message: 'Bạn chưa đăng nhập'
      };
    }
    const userId = session.user.id;

    const parseResult = createProjectSchema.safeParse(
      Object.fromEntries(formData)
    );
    if (!parseResult.success) {
      return {
        success: false,
        message: parseResult.error.issues[0]?.message ?? 'Dữ liệu không hợp lệ'
      };
    }
    const { name, teamId } = parseResult.data;

    const isMember = await prisma.teamMember.findFirst({
      where: {
        userId,
        teamId
      }
    });
    if (!isMember) {
      return {
        success: false,
        message: 'Bạn không thuộc team này'
      };
    }

    await prisma.project.create({
      data: {
        id: uuidv7(),
        name,
        teamId
      }
    });

    return { success: true, message: 'Tạo dự án thành công' };
  } catch (error) {
    Sentry.captureException(error, { tags: { action: 'create-project' } });
    return {
      success: false,
      message: 'Lỗi khi tạo dự án. Vui lòng thử lại sau.'
    };
  }
}

export async function updateProject(formData: FormData) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return {
        success: false,
        message: 'Bạn chưa đăng nhập'
      };
    }
    const userId = session.user.id;

    const parseResult = updateProjectSchema.safeParse(
      Object.fromEntries(formData)
    );
    if (!parseResult.success) {
      return {
        success: false,
        message: parseResult.error.issues[0]?.message ?? 'Dữ liệu không hợp lệ'
      };
    }
    const { id, name, teamId } = parseResult.data;

    const isMember = await prisma.teamMember.findFirst({
      where: { userId, teamId }
    });
    if (!isMember) {
      return {
        success: false,
        message: 'Bạn không thuộc team này'
      };
    }

    const existing = await prisma.project.findFirst({
      where: { id, teamId }
    });
    if (!existing) {
      return {
        success: false,
        message: 'Không tìm thấy dự án hoặc bạn không có quyền chỉnh sửa'
      };
    }

    await prisma.project.update({
      where: { id },
      data: { name }
    });

    return { success: true, message: 'Cập nhật dự án thành công' };
  } catch (error) {
    Sentry.captureException(error, { tags: { action: 'update-project' } });
    return {
      success: false,
      message: 'Lỗi khi sửa dự án. Vui lòng thử lại sau.'
    };
  }
}

export async function deleteProject(formData: FormData) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return {
        success: false,
        message: 'Bạn chưa đăng nhập'
      };
    }
    const userId = session.user.id;

    const parseResult = deleteProjectSchema.safeParse(
      Object.fromEntries(formData)
    );
    if (!parseResult.success) {
      return {
        success: false,
        message: parseResult.error.issues[0]?.message ?? 'Dữ liệu không hợp lệ'
      };
    }
    const { id, teamId } = parseResult.data;

    const isMember = await prisma.teamMember.findFirst({
      where: { userId, teamId }
    });
    if (!isMember) {
      return {
        success: false,
        message: 'Bạn không thuộc team này'
      };
    }

    const existing = await prisma.project.findFirst({
      where: { id, teamId }
    });
    if (!existing) {
      return {
        success: false,
        message: 'Không tìm thấy dự án hoặc bạn không có quyền xóa'
      };
    }

    await prisma.project.delete({
      where: { id }
    });

    return { success: true, message: 'Xóa dự án thành công' };
  } catch (error) {
    Sentry.captureException(error, { tags: { action: 'delete-project' } });
    return {
      success: false,
      message: 'Lỗi khi xóa dự án. Vui lòng thử lại sau.'
    };
  }
}

export async function createEvent(formData: FormData) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return {
        success: false,
        message: 'Bạn chưa đăng nhập'
      };
    }
    const userId = session.user.id;
    const parseResult = createEventProjectSchema.safeParse(
      Object.fromEntries(formData)
    );
    if (!parseResult.success) {
      console.error('Validation error:', parseResult.error);
      return {
        success: false,
        message: parseResult.error.issues[0]?.message ?? 'Dữ liệu không hợp lệ'
      };
    }

    const { title, description, eventDate, projectId } = parseResult.data;

    const s3 = new S3Client({
      region: process.env.AWS_S3_REGION,
      forcePathStyle: true,
      endpoint: process.env.AWS_S3_HOST_NAME,
      credentials: {
        accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY!
      }
    });

    const attachments: {
      name: string;
      url: string;
      filesize: number;
      type: string;
    }[] = [];
    let i = 0;
    while (formData.has(`attachment-${i}-name`)) {
      const userProvidedFileName = formData.get(
        `attachment-${i}-name`
      ) as string;
      const file = formData.get(`attachment-${i}-file`) as File;

      if (file && file.size > 0) {
        const randomId = crypto.randomUUID();
        const uniqueFileName = `${randomId}-${file.name}`;

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const command = new PutObjectCommand({
          Bucket: process.env.AWS_S3_BUCKET_NAME!,
          Key: uniqueFileName,
          Body: buffer,
          ContentType: file.type,
          ACL: 'public-read'
        });

        await s3.send(command);

        attachments.push({
          name: userProvidedFileName || file.name,
          url: uniqueFileName,
          filesize: file.size,
          type: file.type
        });
      }
      i++;
    }

    await prisma.event.create({
      data: {
        id: uuidv7(),
        title,
        description,
        eventDate: new Date(eventDate),
        project: {
          connect: { id: projectId }
        },
        user: {
          connect: { id: userId }
        },
        attachments
      }
    });

    return {
      success: true,
      message: 'Sự kiện đã được tạo thành công'
    };
  } catch (error) {
    Sentry.captureException(error, {
      tags: { action: 'create-event-project' }
    });
    return {
      success: false,
      message: 'Đã xảy ra lỗi khi tạo sự kiện'
    };
  }
}
