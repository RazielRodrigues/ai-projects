import {
    Typography,
    Navbar,
} from "@material-tailwind/react";

import { NavLink } from 'react-router-dom';
import React from 'react';

export default function NavbarDesktop() {


    return (
        <div className={`background hover:text-gray-900`}>
            <Navbar
                className="mx-auto w-full background border-0 rounded-none shadow-none px-4 py-3"
            >
                <div className="flex items-center justify-between text-blue-gray-100">
                    <div className="flex items-center gap-2 font-mono text-sm">
                        <div className="flex items-center gap-4 p-4  ">
                            <Typography variant="h5" >
                                {'Lumus '}
                                <br />
                            </Typography>
                        </div>
                   {/*      <span className=" transition-colors text-white text-lg"
                        >$pages =</span> <span>[</span>
                        <NavLink
                            to="/"
                            className="hover:text-gray-300 transition-colors text-white text-lg"
                        >
                            {"\"Home\""}
                        </NavLink>
                        <span>];</span> */}
                    </div>

                    <div className="flex items-center gap-4">

                        <div className="flex gap-3">
                            <Typography
                                as="a"
                                href="https://www.razielrodrigues.dev/"
                                target="_blank"
                                className="hover:text-gray-300 transition-colors text-white"
                            >
                               Made by Raziel Rodrigues
                            </Typography>
                        </div>
                    </div>
                </div>
            </Navbar>
        </div>

    )
}
