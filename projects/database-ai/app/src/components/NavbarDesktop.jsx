import {
    Typography,
    Navbar,
} from "@material-tailwind/react";
import { Link   } from "react-router-dom";
 

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
                          
                                <Link
                                    to={'/'}
                                    className="hover:text-gray-300 transition-colors  "
                                >
                                    Vibefiner
                                </Link>
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
                            <Link
                                 to={'/explore'}
                                className="hover:text-gray-300 transition-colors text-white"
                            >
                               Explorar
                            </Link>
                            <Link
                                to={'/about'}
                                className="hover:text-gray-300 transition-colors text-white"
                            >
                                Sobre
                            </Link>
                            <Link
                                to={'/pricing'}
                                className="hover:text-gray-300 transition-colors text-white"
                            >
                                Valores
                            </Link>
                            <Link
                                to={'/settings'}
                                className="hover:text-gray-300 transition-colors text-white"
                            >
                                Configurações
                            </Link>
                        </div>
                    </div>
                </div>
            </Navbar>
        </div>

    )
}
