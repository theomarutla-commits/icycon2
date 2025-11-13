import React, { FC, useRef, useEffect } from 'react';
import { services } from '../../../constants';

const ServicesCarousel: FC = () => {
    const duplicatedServices = [...services, ...services];
    const carouselRef = useRef<HTMLDivElement>(null);
    const intervalRef = useRef<number | null>(null);

    const startAutoScroll = () => {
        stopAutoScroll();
        intervalRef.current = window.setInterval(() => {
            if (carouselRef.current) {
                carouselRef.current.scrollLeft += 1;
                if (carouselRef.current.scrollLeft >= carouselRef.current.scrollWidth / 2) {
                    carouselRef.current.scrollLeft = 0;
                }
            }
        }, 25);
    };
    
    const stopAutoScroll = () => {
        if(intervalRef.current !== null) {
            window.clearInterval(intervalRef.current);
        }
    };
    
    useEffect(() => {
        startAutoScroll();
        return () => stopAutoScroll();
    }, []);

    return (
        <div 
            className="w-full relative group"
            onMouseEnter={stopAutoScroll}
            onMouseLeave={startAutoScroll}
        >
            <div ref={carouselRef} className="flex overflow-x-auto py-4 scrollbar-hide" style={{scrollBehavior: 'smooth'}}>
                {duplicatedServices.map((service, index) => (
                    <div key={index} className="flex-shrink-0 w-80 md:w-96 px-4">
                       <div className="bg-slate-800 p-8 rounded-xl border border-slate-700 h-full flex flex-col items-center text-center transform hover:scale-105 hover:border-[#0079d2] transition-all duration-300">
                            <div className="text-[#009dd3]">{service.icon}</div>
                            <h3 className="text-xl font-bold mt-4 mb-2 text-white">{service.title}</h3>
                            <p className="text-slate-400">{service.description}</p>
                        </div>
                    </div>
                ))}
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-transparent to-slate-900 pointer-events-none"></div>
        </div>
    );
};

export default ServicesCarousel;