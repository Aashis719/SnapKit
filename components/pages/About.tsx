import React from 'react';
import { Icons } from '../ui/Icons';

export const About: React.FC = () => {
    const values = [
        {
            icon: Icons.Sparkles,
            title: "AI-Powered",
            description: "Leveraging cutting-edge vision and language models to understand your content"
        },
        {
            icon: Icons.Zap,
            title: "Lightning Fast",
            description: "Generate complete social media kits in seconds, not hours"
        },
        {
            icon: Icons.Heart,
            title: "Creator-First",
            description: "Built by creators, for creators who value their time and creativity"
        }
    ];

    return (
        <div className="min-h-screen pt-14 md:pt-24 pb-20 container mx-auto px-4 lg:px-8 max-w-[1000px]">
            <div className="space-y-16 animate-fade-in">
                {/* Hero Section */}
                <div className="text-center space-y-6">
                    <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-tight">
                        About{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-500 to-pink-500">
                            SnapKit
                        </span>
                    </h1>
                    <p className="text-xl text-text-muted leading-relaxed max-w-2xl mx-auto">
                        Transforming the way creators make content for social media
                    </p>
                </div>

                {/* Mission Statement */}
                <div className="bg-surface/50 border border-surfaceHighlight rounded-3xl p-8 md:p-12 backdrop-blur-sm">
                    <div className="space-y-6">
                        <h2 className="text-3xl font-bold text-white">Our Mission</h2>
                        <p className="text-lg text-text-muted leading-relaxed">
                            We believe creating engaging social media content shouldn't take hours. SnapKit uses AI to turn your photos into complete social media kits captions, hashtags, and video scripts in seconds. Spend less time writing, more time creating.
                        </p>
                    </div>
                </div>

                {/* Values Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {values.map((value, index) => (
                        <div
                            key={index}
                            className="bg-surface/50 border border-surfaceHighlight rounded-2xl p-6 hover:border-primary/50 transition-all duration-300 group"
                        >
                            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                                <value.icon className="w-6 h-6 text-primary" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">{value.title}</h3>
                            <p className="text-sm text-text-muted leading-relaxed">{value.description}</p>
                        </div>
                    ))}
                </div>

                {/* Story Section */}
                <div className="bg-gradient-to-br from-primary/10 via-purple-500/10 to-pink-500/10 border border-primary/20 rounded-3xl p-8 md:p-12 backdrop-blur-sm">
                    <div className="space-y-6">
                        <h2 className="text-3xl font-bold text-white">The Story</h2>
                        <div className="space-y-4 text-text-muted leading-relaxed">
                            <p>
                                SnapKit was born from a simple observation: content creators were spending more time managing their social media presence than actually creating. Writing captions, researching hashtags, and adapting content for different platforms was eating up valuable creative time.
                            </p>
                            <p>
                                We built SnapKit to change that. By combining advanced AI vision technology with deep social media expertise, we've created a tool that understands your images and generates platform-optimized content instantly.
                            </p>
                            <p>
                                Today, SnapKit helps creators reclaim their time and focus on what they do best, creating amazing content.
                            </p>
                        </div>
                    </div>
                </div>

                {/* CTA */}
                <div className="text-center pt-8">
                    <a
                        href="/"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary to-purple-600 hover:from-purple-600 hover:to-primary text-white font-bold rounded-xl shadow-lg shadow-primary/30 transition-all transform hover:scale-105"
                    >
                        <Icons.Sparkles className="w-5 h-5" />
                        Try SnapKit Now
                    </a>
                </div>
            </div>
        </div>
    );
};
