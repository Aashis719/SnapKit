import React from 'react';
import { Link } from 'react-router-dom';
import { Icons } from '../ui/Icons';

export const NotFound: React.FC = () => {
    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <div className="text-center max-w-2xl mx-auto">
                {/* Animated 404 */}
                <div className="relative mb-8">
                    <div className="text-[180px] md:text-[240px] font-black text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-500 to-pink-500 leading-none animate-pulse">
                        404
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-32 h-32 bg-gradient-to-r from-primary to-purple-600 rounded-full blur-3xl opacity-30 animate-pulse"></div>
                    </div>
                </div>

                {/* Error Message */}
                <div className="space-y-6 mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-white">
                        Oops! Page Not Found
                    </h1>
                    <p className="text-lg text-text-muted max-w-md mx-auto">
                        Looks like this page went viral and disappeared into the social media void.
                        Let's get you back on track!
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <Link
                        to="/"
                        className="group flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary to-purple-600 hover:from-purple-600 hover:to-primary text-white font-bold rounded-xl shadow-lg shadow-primary/30 transition-all transform hover:scale-105"
                    >
                        <Icons.Home className="w-5 h-5" />
                        Back to Home
                    </Link>

                    <Link
                        to="/features"
                        className="flex items-center gap-2 px-8 py-4 bg-surfaceHighlight hover:bg-surface text-white font-medium rounded-xl border border-border transition-all"
                    >
                        <Icons.Sparkles className="w-5 h-5 text-primary" />
                        Explore Features
                    </Link>
                </div>

                {/* Decorative Elements */}
                <div className="mt-16 grid grid-cols-3 gap-4 max-w-md mx-auto opacity-50">
                    <div className="h-2 bg-gradient-to-r from-transparent via-primary to-transparent rounded-full animate-pulse"></div>
                    <div className="h-2 bg-gradient-to-r from-transparent via-purple-500 to-transparent rounded-full animate-pulse delay-100"></div>
                    <div className="h-2 bg-gradient-to-r from-transparent via-pink-500 to-transparent rounded-full animate-pulse delay-200"></div>
                </div>
            </div>
        </div>
    );
};
