import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const CategorySlider = () => {
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [scrollPosition, setScrollPosition] = useState(0);
    const sliderRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    const categoryColors = [
        'bg-pink-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500',
        'bg-purple-500', 'bg-red-500', 'bg-indigo-500', 'bg-orange-500',
        'bg-teal-500', 'bg-cyan-500', 'bg-lime-500', 'bg-emerald-500',
        'bg-violet-500', 'bg-fuchsia-500', 'bg-rose-500', 'bg-sky-500'
    ];

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await api.get('/categories');
                if (Array.isArray(response.data)) {
                    setCategories(response.data);
                } else {
                    console.warn("Categories API returned non-array data:", response.data);
                    setCategories([]);
                }
            } catch (error: any) {
                console.error("Failed to fetch categories", error);
                if (error.code === 'ERR_NETWORK') {
                    console.error("Network error: Is the API Gateway (port 8095) running?");
                }
                setCategories([]);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    useEffect(() => {
        // Auto-scroll animation
        const interval = setInterval(() => {
            if (sliderRef.current && categories.length > 0) {
                const maxScroll = sliderRef.current.scrollWidth - sliderRef.current.clientWidth;
                if (scrollPosition >= maxScroll) {
                    setScrollPosition(0);
                } else {
                    setScrollPosition(prev => prev + 1);
                }
            }
        }, 50); // Slow scroll speed

        return () => clearInterval(interval);
    }, [scrollPosition, categories.length]);

    const handleCategoryClick = (categoryName: string) => {
        navigate(`/category/${encodeURIComponent(categoryName.toLowerCase())}`);
    };

    const scrollLeft = () => {
        if (sliderRef.current) {
            const newPosition = Math.max(0, scrollPosition - 200);
            setScrollPosition(newPosition);
        }
    };

    const scrollRight = () => {
        if (sliderRef.current) {
            const maxScroll = sliderRef.current.scrollWidth - sliderRef.current.clientWidth;
            const newPosition = Math.min(maxScroll, scrollPosition + 200);
            setScrollPosition(newPosition);
        }
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-6">
                <div className="flex justify-center">
                    <div className="text-gray-500 animate-pulse">Loading categories...</div>
                </div>
            </div>
        );
    }

    if (categories.length === 0) {
        return null;
    }

    return (
        <div className="container mx-auto px-4 py-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Shop by Category</h2>
            
            <div className="relative">
                {/* Left Arrow */}
                <button
                    onClick={scrollLeft}
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
                    aria-label="Scroll left"
                >
                    <ChevronLeft size={20} className="text-gray-600" />
                </button>

                {/* Right Arrow */}
                <button
                    onClick={scrollRight}
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
                    aria-label="Scroll right"
                >
                    <ChevronRight size={20} className="text-gray-600" />
                </button>

                {/* Category Slider */}
                <div
                    ref={sliderRef}
                    className="overflow-hidden"
                    style={{ scrollBehavior: 'smooth' }}
                >
                    <div
                        className="flex gap-4 py-2"
                        style={{ transform: `translateX(-${scrollPosition}px)` }}
                    >
                        {categories.map((category, index) => {
                            const colorClass = categoryColors[index % categoryColors.length];
                            return (
                                <div
                                    key={category.id || category.name}
                                    onClick={() => handleCategoryClick(category.name)}
                                    className={`flex-shrink-0 cursor-pointer transform transition-all duration-300 hover:scale-105`}
                                >
                                    <div
                                        className={`${colorClass} text-white rounded-lg p-6 w-32 h-32 flex flex-col items-center justify-center shadow-lg hover:shadow-xl transition-shadow`}
                                    >
                                        <div className="text-lg font-bold text-center capitalize">
                                            {category.name}
                                        </div>
                                        <div className="text-xs mt-1 opacity-90">
                                            {category.productCount || 0} items
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                        
                        {/* Duplicate categories for seamless loop */}
                        {categories.map((category, index) => {
                            const colorClass = categoryColors[index % categoryColors.length];
                            return (
                                <div
                                    key={`duplicate-${category.id || category.name}`}
                                    onClick={() => handleCategoryClick(category.name)}
                                    className={`flex-shrink-0 cursor-pointer transform transition-all duration-300 hover:scale-105`}
                                >
                                    <div
                                        className={`${colorClass} text-white rounded-lg p-6 w-32 h-32 flex flex-col items-center justify-center shadow-lg hover:shadow-xl transition-shadow`}
                                    >
                                        <div className="text-lg font-bold text-center capitalize">
                                            {category.name}
                                        </div>
                                        <div className="text-xs mt-1 opacity-90">
                                            {category.productCount || 0} items
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CategorySlider;
