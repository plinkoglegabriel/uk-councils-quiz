// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { Client } from "@notionhq/client"

type Data = {
  name: string
}

const notion = new Client({ auth: process.env.NOTION_KEY });

const databaseId = process.env.NOTION_DATABASE_ID || '';


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    const response: any = await notion.databases.query({
      database_id: databaseId
    });
    res.status(200).json(response);
  } catch (error: any) {
    console.error(error.body)
  }
}
