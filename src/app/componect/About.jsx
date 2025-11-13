import React from 'react'

export default function About() {
    return (
        <div>
            <section id="about" className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
                    <div className="lg:col-span-2">
                        <h3 className="text-2xl font-semibold">เกี่ยวกับเรา</h3>
                        <p className="mt-4 text-slate-600">เราคือทีมพัฒนาที่เน้นการแก้ปัญหาทางธุรกิจด้วยโซลูชันดิจิทัล — ตั้งแต่วางแผน UX ไปจนถึงการดูแลหลังส่งมอบ</p>

                        <dl className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="p-4 bg-white border rounded-lg">
                                <dt className="text-sm text-slate-500">วิสัยทัศน์</dt>
                                <dd className="mt-1 font-semibold">เป็นพาร์ทเนอร์ดิจิทัลที่ธุรกิจไว้วางใจ</dd>
                            </div>
                            <div className="p-4 bg-white border rounded-lg">
                                <dt className="text-sm text-slate-500">พันธกิจ</dt>
                                <dd className="mt-1 font-semibold">ออกแบบผลิตภัณฑ์ที่ใช้งานได้จริง เพิ่มมูลค่าธุรกิจ</dd>
                            </div>
                        </dl>
                    </div>

                </div>
            </section>
        </div>
    )
}
