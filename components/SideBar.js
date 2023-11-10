import React from "react";
import {
  UserGroupIcon,
  ServerIcon,
  CalendarIcon,
  ChartSquareBarIcon,
  CogIcon,
} from "@heroicons/react/outline";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
const Sidebar = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();

  const links = [
    {
      href: "/home",
      icon: <UserGroupIcon className="w-7 h-7" />,
      text: "Home",
    },
  ];
  const [isDesktop, setIsDesktop] = useState(false);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024); // You can adjust the width threshold according to your needs
    };

    handleResize(); // Call the function once to set the initial value
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  return <></>;

  //   return (
  //     <div className="flex flex-col lg:flex-row lg:h-screen">
  //       <main className="lg:ml-20 w-full lg:flex-1">{children}</main>
  //       {isDesktop ? (
  //         <div className="lg:w-20 lg:h-screen p-4 lg:bg-white lg:border-r-[1px] lg:flex lg:flex-col lg:justify-between fixed bottom-0 left-0 right-0 bg-white border-t-[1px] flex flex-row justify-around items-center">
  //           <div className="flex flex-col items-center">
  //             {links.map((link, index) => (
  //               <Link key={index} href={link.href}>
  //                 <div
  //                   className={`${
  //                     pathname === link.href ? "bg-orange-100" : "bg-gray-100"
  //                   } hover:scale-110 cursor-pointer my-4 p-3 rounded-lg inline-block`}
  //                 >
  //                   {link.icon}
  //                 </div>
  //               </Link>
  //             ))}
  //           </div>
  //         </div>
  //       ) : (
  //         <>
  //           <div
  //             className={`lg:w-20 lg:h-[200px] p-2 lg:bg-white lg:border-r-[1px] lg:flex lg:flex-col ${
  //               isSidebarVisible ? "justify-center" : "justify-between"
  //             } fixed bottom-0 left-0 right-0 bg-white border-t-[1px] flex flex-row justify-around items-center rounded-t-3xl custom-transition`}
  //           >
  //             {isSidebarVisible && (
  //               <>
  //                 {" "}
  //                 {links.map((link, index) => (
  //                   <Link key={index} href={link.href}>
  //                     <div
  //                       className={`${
  //                         pathname === link.href ? "bg-orange-100" : "bg-gray-100"
  //                       } hover:scale-110 cursor-pointer my-4 p-3 rounded-lg inline-block`}
  //                     >
  //                       {link.icon}
  //                     </div>
  //                   </Link>
  //                 ))}
  //               </>
  //             )}
  //           </div>
  //           <div className="lg:hidden fixed bottom-24 right-8  z-10 ">
  //             <div
  //               onClick={() => setIsSidebarVisible(!isSidebarVisible)}
  //               className="p-2 rounded-full text-gray-500 cursor-pointer hover:text-gray-700 bg-primary transition duration-300 ease-in-out "
  //             >
  //               {isSidebarVisible ? (
  //                 <svg
  //                   xmlns="http://www.w3.org/2000/svg"
  //                   fill="none"
  //                   viewBox="0 0 24 24"
  //                   stroke="white"
  //                   className="w-6 h-6 hover:text-gray-700"
  //                 >
  //                   <path
  //                     strokeLinecap="round"
  //                     strokeLinejoin="round"
  //                     strokeWidth={2}
  //                     d="M6 18L18 6M6 6l12 12"
  //                   />
  //                 </svg>
  //               ) : (
  //                 <svg
  //                   xmlns="http://www.w3.org/2000/svg"
  //                   fill="none"
  //                   viewBox="0 0 24 24"
  //                   stroke="white"
  //                   className="w-6 h-6 hover:text-gray-700"
  //                 >
  //                   <path
  //                     strokeLinecap="round"
  //                     strokeLinejoin="round"
  //                     strokeWidth={2}
  //                     d="M4 6h16M4 12h16m-7 6h7"
  //                   />
  //                 </svg>
  //               )}
  //             </div>
  //           </div>
  //         </>
  //       )}
  //     </div>
  //   );
};

export default Sidebar;
