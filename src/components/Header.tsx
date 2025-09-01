'use client'

import Link from "next/link"
import styles from './header.module.css'
import createClient from "@/utils/supabase/client"
import { useEffect, useState } from "react"
import { Button} from 'antd'

const Header = () => {

const supabase = createClient()

const [isLoggedin, setIsLoggedIn] = useState<boolean>(false)

useEffect(() => {
    // check on mount
    const loadSession = async () => {
        const { data } = await supabase.auth.getSession()
        setIsLoggedIn(!!data.session)
    }
    loadSession()

    const { data: subscription} = supabase.auth.onAuthStateChange((_event, session) => {
        setIsLoggedIn(!!session)
    })

    return () => {
        subscription.subscription.unsubscribe()
    }
}, [supabase])

const handleLogOut = async () => {
    await supabase.auth.signOut()
    setIsLoggedIn(false)
}


    return(
        <header className={styles.header}>
            <div className={styles.logo}>Survey App</div>
            <nav>
                <Link className={styles.link} href='/'>Home</Link>
                {isLoggedin ? (
                    <Button onClick={handleLogOut}>Log out</Button>
                ) :
                (
                    <>
                       <Link className={styles.link}  href='/sign-up'>Sign Up</Link>
                <Link className={styles.link}  href='/log-in'>Log in</Link>
                </>
                )
                
                }

            </nav>
        </header>
    )
}

export default Header