// src/app/sitemap.js

export default function sitemap() {
  return [
    {
      url: 'https://tjc.co.th',
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 1,
    },
    // ถ้ามีหน้าอื่น เช่น หน้า About ก็เพิ่มต่อท้ายได้เลยครับ
    // {
    //   url: 'https://tjc.co.th/about',
    //   lastModified: new Date(),
    //   changeFrequency: 'monthly',
    //   priority: 0.8,
    // },
  ]
}