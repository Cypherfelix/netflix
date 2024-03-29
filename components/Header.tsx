import { BellIcon, SearchIcon } from '@heroicons/react/solid'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import useAuth from '../hooks/useAuth'

function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const { logout, error } = useAuth()

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }
    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const handleClick = async (type: string) => {
    if (type == 'logout') {
      await logout()
      if (error) {
      }
    }
  }

  return (
    <header
      className={`w-screen overflow-x-hidden ${isScrolled && 'bg-[#141414]'}`}
    >
      <div className="flex items-center space-x-2 md:space-x-10">
        <img
          src="https://rb.gy/ulxxee"
          width={100}
          height={100}
          className="cursor-pointer object-contain"
          onClick={() => handleClick('logout')}
        />

        <ul className="hidden space-x-4 md:flex">
          <li className="headerLink">Home</li>
          <li className="headerLink">TV Shows</li>
          <li className="headerLink">Movies</li>
          <li className="headerLink">New & Popular</li>
          <li className="headerLink">My List</li>
        </ul>
      </div>

      <div className="flex items-center space-x-4 text-sm font-light">
        <SearchIcon className="hidden h-6 w-6 sm:inline " />
        <p className="hidden lg:inline">Kids</p>
        <BellIcon className=" h-6 w-6" />

        <Link href="/account">
          <img
            src="https://rb.gy/g1pwyx"
            alt=""
            className="cursor-pointer rounded"
            onClick={() => handleClick('logout')}
          />
        </Link>
      </div>
    </header>
  )
}

export default Header
