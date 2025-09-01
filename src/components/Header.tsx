'use client'

import Link from "next/link"
import styles from './header.module.css'

const Header = () => {
    return(
        <header className={styles.header}>
            <div className={styles.logo}>Survey App</div>
            <nav>
                <Link className={styles.link} href='/'>Home</Link>
                <Link className={styles.link}  href='/sign-up'>Sign Up</Link>
                <Link className={styles.link}  href='/log-in'>Log in</Link>
            </nav>
        </header>
    )
}

export default Header