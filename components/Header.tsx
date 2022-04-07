import React from 'react'
import Link from 'next/link'

const Header = ({}) => {
    return (
        <header className="flex items-center justify-between px-5 py-2 max-w-7xl mx-auto">
            <div className="flex items-center space-x-5">
                <Link href="/">
                    <div className="flex items-center cursor-pointer tracking-tight">
                        <img
                            className="w-10 object-contain"
                            src="https://cdn.iconscout.com/icon/free/png-256/medium-logo-3610097-3014862.png"
                            alt="Logo image"
                        />
                        <span className="font-serif text-3xl font-semibold">Median</span>
                    </div>
                </Link>
                <div className="hidden md:inline-flex items-center space-x-5">
                    <h3>About</h3>
                    <h3>Contact</h3>
                    <h3 className="px-4 py-1 rounded-full text-white bg-green-600 cursor-pointer">Follow</h3>
                </div>
            </div>
            <div className="flex items-center space-x-5 text-green-600">
                <h3 className='hidden md:inline cursor-pointer'>Sign in</h3>
                <h3 className="border border-green-600 px-4 py-1 rounded-full pointer cursor-pointer">Get Started</h3>
            </div>
        </header>
    )
}

export default Header
