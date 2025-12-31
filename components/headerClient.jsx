"use client";

import Link from 'next/link'
import Image from "next/image";
import { User,Calendar ,Stethoscope } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { CreditCard } from "lucide-react";


import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";

import React from 'react'
import {Button} from '@/components/ui/button';

const HeaderClient = ({ serverUser }) => {
  const role = serverUser?.role;
  

  return (
    <header className='fixed top-0 w-full border-b bg-background/80 backdrop-blur-md z-10 supports-backdrop-filter:bg-background/60'>
        <nav className='container mx-auto px-4 h-16 flex items-center justify-between'>
            <Link href='/'> 
                <Image
                src ='/logo-single.png'
                alt = 'MediMeet Logo'
                width = {200}
                height={60}
                className ='h-10 w-auto object-contain'
                />
            </Link>

            <div className='flex items-center space-x-2'>
              <SignedIn>
                {
                  (role === "ADMIN")&&
                   ( 
                    <Link href="/admin">
                      <Button variant="outline"className="hidden md:inline-flex items-center gap-2">
                      <Stethoscope className ="h-4 w-4"/>
                       Admin Dashboard
                      </Button>
                      <Button variant="ghost" className="hidden md:inline-flex items-center gap-2">
                         <Calendar className ="h-4 w-4"/>
                      </Button>
                    </Link >

                  )}
                {
                  (role === "DOCTOR") &&
                   ( 
                    <Link href="/doctor">
                      <Button variant="outline"className="hidden md:inline-flex items-center gap-2">
                      <Stethoscope className ="h-4 w-4"/>
                       Doctor Dashboard
                      </Button>
                      <Button variant="ghost" className="hidden md:inline-flex items-center gap-2">
                         <Calendar className ="h-4 w-4"/>
                      </Button>
                    </Link >

                  )}
                {
                  (role === "PATIENT") &&
                   ( 
                    <Link href="/appointments">
                      <Button variant="outline"className="hidden md:inline-flex items-center gap-2">
                      <Calendar className ="h-4 w-4"/>
                       My Appointments
                      </Button>
                      <Button variant="ghost" className="hidden md:inline-flex items-center gap-2">
                         <Calendar className ="h-4 w-4"/>
                      </Button>
                    </Link >

                  )}
                  {
                  ( role === "UNASSIGNED") &&
                   ( 
                    <Link href="/onboarding">
                      <Button 
                      variant="outline"
                      className="hidden md:inline-flex items-center gap-2"
                      >
                      <User className ="h-4 w-4"/>
                       Complete Profile
                      </Button>
                    </Link >

                  )}
              </SignedIn>

                {(!serverUser || serverUser?.role === "PATIENT") && (
                  <Link href="/pricing">
                    <Badge
                      variant="outline"
                      className="bg-emerald-900/30 border-emerald-700/30 px-4 py-2 text-emerald-400 text-sm font-medium mb-4"
                    >
                      <CreditCard className="h-3.5 w-3.5 text-emerald-400" />

                      <span className="text-emerald-400">
                        {serverUser?.role === "PATIENT" ? (
                          <>
                            {serverUser.credits}{" "}
                            <span className="hidden md:inline"></span>
                          </>
                        ) : (
                          <>Pricing</>
                        )}
                      </span>
                    </Badge>
                  </Link>
                )}
    
                   

               <SignedOut>
                  <SignInButton>
                    <Button variant = 'secondary '> Sign In </Button>
                  </SignInButton>
                </SignedOut>

                <SignedIn>
                    <UserButton
                    appearance={{
                        elements : {
                            avatarBox : "w-10 h-10",
                            userButtonPopoverCard : "shadow-xl",
                            userPreviewMainIdentifier : "font-semibold",
                        },
                    }} 
                    />
                </SignedIn>
            </div>
        </nav>
    </header>
  )
}

export default HeaderClient;