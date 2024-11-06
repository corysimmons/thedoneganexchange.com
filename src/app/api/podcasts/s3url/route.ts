// src/app/api/podcasts/s3url/route.ts
import { S3Client, PutObjectCommand, ObjectCannedACL } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { NextResponse } from 'next/server'

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
})

export async function POST(request: Request) {
  const { fileName, fileType } = await request.json()

  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: `audio/${fileName}`,
    ContentType: fileType,
    // ACL: ObjectCannedACL.public_read, // Corrected to use the lowercase version
  }

  try {
    const command = new PutObjectCommand(params)
    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 })
    const fileUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/audio/${fileName}`

    return NextResponse.json({ signedUrl, fileUrl })
  } catch (error) {
    console.error('Error creating signed URL:', error)
    return NextResponse.json(
      { error: 'Failed to generate signed URL' },
      { status: 500 },
    )
  }
}
