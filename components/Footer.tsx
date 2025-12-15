import React from 'react';
import { Link } from 'react-router-dom';
import { Icons } from './ui/Icons';

export const Footer: React.FC = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="relative z-10 border-t border-border/50 bg-background mt-auto">
            <div className="container mx-auto px-6 py-8 max-w-7xl">
                {/* Main Footer Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-6">

                    {/* Brand Section */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <div className="w-7 h-7">
                                <img src="/snapkit.png" alt="SnapKit Logo" className="w-full h-full object-cover" />
                            </div>
                            <h3 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-400 to-primary">
                                SnapKit
                            </h3>
                        </div>
                        <p className="text-sm text-text-muted/80 max-w-xs leading-relaxed">
                            Transform your photos into viral content with AI-powered captions, hashtags, and scripts.
                        </p>
                        {/* Social Links - Clean minimal style */}
                        <div className="flex items-center gap-4 pt-1">
                            <a
                                href="#"
                                className="text-text-muted hover:text-primary transition-colors"
                                aria-label="Twitter"
                            >
                                <Icons.Twitter className="w-5 h-5" />
                            </a>
                            <a
                                href="#"
                                className="text-text-muted hover:text-primary transition-colors"
                                aria-label="GitHub"
                            >
                                <Icons.Github className="w-5 h-5" />
                            </a>
                            <a
                                href="#"
                                className="text-text-muted hover:text-primary transition-colors"
                                aria-label="LinkedIn"
                            >
                                <Icons.Linkedin className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className='text-left md:text-center  '>
                        <h4 className="text-sm font-semibold text-white mb-3">QUICK LINKS</h4>
                        <ul className="space-y-2 ">
                            <li>
                                <Link to="/features" className="text-sm text-text-muted/80 hover:text-white transition-colors">
                                    Features
                                </Link>
                            </li>
                            <li>
                                <Link to="/about" className="text-sm text-text-muted/80 hover:text-white transition-colors">
                                    About
                                </Link>
                            </li>
                            <li>
                                <Link to="/privacy-policy" className="text-sm text-text-muted/80 hover:text-white transition-colors">
                                    Privacy Policy
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar - Simplified */}
                <div className="pt-6 border-t border-border/30">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-sm text-text-muted/70">
                        <p>
                            © {currentYear} <span className="text-primary font-medium animate-pulse"><a href="/">SnapKit</a></span>. All rights reserved.
                        </p>
                        <p className="flex items-center gap-1.5">
                            Made with <Icons.Heart className="w-3.5 h-3.5 text-red-500 animate-pulse" /> by <a href="https://www.aashishneupane.com.np/" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primaryHover transition-colors">Aashish</a>
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
};
