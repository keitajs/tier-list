import { Resend } from 'resend'
import fs from 'fs'

const resend = new Resend(process.env.RESEND_KEY)

export const sendMail = async (to, subject, template, values) => {
  let html = fs.readFileSync(template).toString()

  for (const [key, value] of Object.entries(values)){
    html = html.replaceAll('{' + key + '}', value)
  }

  await resend.emails.send({ from: 'noreply@tejfolos.sbcraft.hu', to, subject, html })
}