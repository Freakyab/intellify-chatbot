"use client";
import React, { createContext, useContext, useEffect, useState } from "react";

const LAPTOP_BREAKPOINT = 1024;

const ScreenWidthContext = createContext<{ isVisible: boolean }>({ isVisible: true });

const useScreenWidth = () => {
    const [screenWidth, setScreenWidth] = useState(0); // Default to 0, safe for SSR
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const handleResize = () => {
            setScreenWidth(window.innerWidth); // Access window safely inside useEffect
        };

        if (typeof window !== "undefined") {
            handleResize(); // Initial call to set the screen width
            window.addEventListener("resize", handleResize);
        }

        return () => {
            if (typeof window !== "undefined") {
                window.removeEventListener("resize", handleResize);
            }
        };
    }, []);

    useEffect(() => {
        setIsVisible(screenWidth >= LAPTOP_BREAKPOINT);
    }, [screenWidth]);

    return { isVisible };
};

export const ScreenWidthProvider = ({ children }: { children: React.ReactNode }) => {
    const screenWidthState = useScreenWidth();

    return (
        <ScreenWidthContext.Provider value={screenWidthState}>
            {/* {screenWidthState.isVisible ? (
                <React.Fragment>{children}</React.Fragment>
            ) : ( */}
                <div className="flex h-screen items-center justify-center bg-gray-50">
                    Please use a laptop or desktop to view this page
                </div>
            {/* )} */}
        </ScreenWidthContext.Provider>
    );
};

export const useScreenWidthContext = () => useContext(ScreenWidthContext);
