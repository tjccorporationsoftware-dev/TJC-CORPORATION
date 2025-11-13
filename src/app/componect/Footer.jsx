import React from 'react'

export default function Footer() {
    return (
        <div>
            <footer className="bg-white border-t mt-12">
                <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-md  from-indigo-500 to-pink-500 text-white flex items-center justify-center font-bold">C</div>
                        <div>
                            <div className="text-sm font-semibold">Company</div>
                            <div className="text-xs text-slate-500">© {new Date().getFullYear()} Company Co. All rights reserved.</div>
                        </div>
                    </div>

                    <nav className="flex gap-4 text-sm text-slate-600">
                        <a href="#">Privacy</a>
                        <a href="#">Terms</a>
                        <a href="#">Sitemap</a>
                    </nav>
                </div>
            </footer>
        </div>
    )
}
