"use client";
import React, { createContext, useContext, useEffect, useState } from "react";

// Define the laptop breakpoint (you can adjust this value as needed)
const LAPTOP_BREAKPOINT = 1024;

const ScreenWidthContext = createContext<{ isVisible: boolean }>({ isVisible: true });

const useScreenWidth = () => {
    const [screenWidth, setScreenWidth] = useState(window.innerWidth);
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const handleResize = () => {
            setScreenWidth(window.innerWidth);
        };

        window.addEventListener("resize", handleResize);
        handleResize(); // Initial call to set the screen width

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    useEffect(() => {
        if (screenWidth < LAPTOP_BREAKPOINT) {
            setIsVisible(false);
        } else {
            setIsVisible(true);
        }
    }, [screenWidth]);

    return { isVisible };
};

export const ScreenWidthProvider = ({ children }: { children: React.ReactNode }) => {
    const screenWidthState = useScreenWidth();

    return (
        <ScreenWidthContext.Provider value={screenWidthState}>
            {screenWidthState.isVisible ? (
                <>{children}</>
            ) : (
                <div className="flex h-screen items-center justify-center bg-gray-50">
                    Please use a laptop or desktop to view this page
                </div>
            )}
        </ScreenWidthContext.Provider>
    );
};

export const useScreenWidthContext = () => useContext(ScreenWidthContext);
