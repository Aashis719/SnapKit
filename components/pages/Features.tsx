import React, { useState } from 'react';
import { Icons } from '../ui/Icons';

export const Features: React.FC = () => {
    const [activeFeature, setActiveFeature] = useState<number | null>(null);

    const mainFeatures = [
        {
            icon: Icons.Sparkles,
            title: "AI Vision Analysis",
            subtitle: "Context-Aware Intelligence",
            description: "Our advanced AI doesn't just see your image it understands it. Analyzing composition, subjects, mood, and context to generate captions that truly resonate with your content.",
            highlights: ["Scene Recognition", "Mood Detection", "Subject Identification", "Color Analysis"],
            gradient: "from-primary via-purple-500 to-pink-500",
            iconBg: "bg-gradient-to-br from-primary/20 to-purple-500/20",
            iconColor: "text-primary"
        },
        {
            icon: Icons.MessageSquare,
            title: "Multi-Platform Captions",
            subtitle: "Optimized for Every Network",
            description: "Generate platform-specific captions tailored to each social network's unique style and character limits. From Instagram's visual storytelling to LinkedIn's professional tone.",
            highlights: ["Instagram Posts", "TikTok Captions", "LinkedIn Updates", "Twitter Threads"],
            gradient: "from-blue-500 via-cyan-500 to-teal-500",
            iconBg: "bg-gradient-to-br from-blue-500/20 to-cyan-500/20",
            iconColor: "text-blue-400"
        },
        {
            icon: Icons.Video,
            title: "Video Script Generation",
            subtitle: "From Photo to Viral Video",
            description: "Transform static images into engaging video concepts. Get complete scripts with hooks, scene breakdowns, timestamps, and CTAs for TikTok and YouTube Shorts.",
            highlights: ["Attention Hooks", "Scene Breakdown", "Audio Suggestions", "Call-to-Actions"],
            gradient: "from-red-500 via-orange-500 to-yellow-500",
            iconBg: "bg-gradient-to-br from-red-500/20 to-orange-500/20",
            iconColor: "text-red-400"
        },
        {
            icon: Icons.Hash,
            title: "Smart Hashtag Strategy",
            subtitle: "Maximize Your Reach",
            description: "Get three tiers of hashtags: high-volume for reach, niche for targeting, and community for engagement. Each set is contextually relevant to your image content.",
            highlights: ["Reach Hashtags", "Niche Targeting", "Community Tags", "Trending Analysis"],
            gradient: "from-pink-500 via-rose-500 to-purple-500",
            iconBg: "bg-gradient-to-br from-pink-500/20 to-purple-500/20",
            iconColor: "text-pink-400"
        },
        {
            icon: Icons.Settings,
            title: "Tone Customization",
            subtitle: "Your Voice, Amplified",
            description: "Choose from five distinct tones to match your brand personality. Whether you're building a professional presence or creating playful content, we've got you covered.",
            highlights: ["Professional", "Playful", "Minimal", "Inspirational", "Funny"],
            gradient: "from-purple-500 via-indigo-500 to-blue-500",
            iconBg: "bg-gradient-to-br from-purple-500/20 to-indigo-500/20",
            iconColor: "text-purple-400"
        },
        {
            icon: Icons.Clock,
            title: "History & Archive",
            subtitle: "Never Lose a Great Idea",
            description: "All your generated content is automatically saved and searchable. Revisit past creations, repurpose successful content, and maintain a library of your best work.",
            highlights: ["Auto-Save", "Quick Search", "One-Click Reuse", "Cloud Storage"],
            gradient: "from-green-500 via-emerald-500 to-teal-500",
            iconBg: "bg-gradient-to-br from-green-500/20 to-emerald-500/20",
            iconColor: "text-green-400"
        }
    ];

    const workflowSteps = [
        {
            number: "01",
            title: "Upload Your Image",
            description: "Drag and drop or select any photo from your device",
            icon: Icons.Upload
        },
        {
            number: "02",
            title: "Choose Your Tone",
            description: "Select the voice that matches your brand identity",
            icon: Icons.Settings
        },
        {
            number: "03",
            title: "Generate Content",
            description: "AI analyzes and creates your complete social media kit",
            icon: Icons.Sparkles
        },
        {
            number: "04",
            title: "Copy & Post",
            description: "One-click copy for all platforms and start posting",
            icon: Icons.Copy
        }
    ];

    return (
        <div className="min-h-screen pt-14 md:pt-24 pb-20 container mx-auto px-4 lg:px-8 max-w-[1400px]">
            {/* Hero Section */}
            <div className="text-center max-w-4xl mx-auto mb-24 animate-fade-in">
               

                <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight">
                    Everything You Need to Go
                    <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-500 to-pink-500">
                        Viral on Social Media
                    </span>
                </h1>

                <p className="text-xl text-text-muted leading-relaxed max-w-2xl mx-auto">
                    SnapKit combines cutting-edge AI vision with social media expertise to transform
                    your photos into scroll-stopping content across all major platforms.
                </p>
            </div>

            {/* Main Features Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-24">
                {mainFeatures.map((feature, index) => (
                    <div
                        key={index}
                        onMouseEnter={() => setActiveFeature(index)}
                        onMouseLeave={() => setActiveFeature(null)}
                        className="group relative bg-surface/50 backdrop-blur-sm border border-surfaceHighlight rounded-3xl p-8 hover:border-primary/50 transition-all duration-500 overflow-hidden"
                    >
                        {/* Gradient Background on Hover */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>

                        {/* Content */}
                        <div className="relative z-10">
                            {/* Icon */}
                            <div className={`w-16 h-16 rounded-2xl ${feature.iconBg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                <feature.icon className={`w-8 h-8 ${feature.iconColor}`} />
                            </div>

                            {/* Title & Subtitle */}
                            <div className="mb-4">
                                <h3 className="text-2xl font-bold text-white mb-1 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-primary transition-all duration-300">
                                    {feature.title}
                                </h3>
                                <p className="text-sm text-primary font-medium">
                                    {feature.subtitle}
                                </p>
                            </div>

                            {/* Description */}
                            <p className="text-text-muted leading-relaxed mb-6">
                                {feature.description}
                            </p>

                            {/* Highlights */}
                            <div className="grid grid-cols-2 gap-3">
                                {feature.highlights.map((highlight, idx) => (
                                    <div
                                        key={idx}
                                        className="flex items-center gap-2 text-sm"
                                        style={{
                                            animation: activeFeature === index
                                                ? `fadeInUp 0.3s ease-out ${idx * 0.1}s both`
                                                : 'none'
                                        }}
                                    >
                                        <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                                        <span className="text-text-muted group-hover:text-white transition-colors">
                                            {highlight}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Corner Accent */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </div>
                ))}
            </div>

            {/* How It Works Section */}
            <div className="mb-24">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        How It <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500">Works</span>
                    </h2>
                    <p className="text-lg text-text-muted max-w-2xl mx-auto">
                        From upload to viral post in under 10 seconds. It's that simple.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {workflowSteps.map((step, index) => (
                        <div key={index} className="relative">
                            {/* Connector Line */}
                            {index < workflowSteps.length - 1 && (
                                <div className="hidden lg:block absolute top-16 left-[60%] w-full h-0.5 bg-gradient-to-r from-primary/50 to-transparent"></div>
                            )}

                            <div className="relative bg-surface/50 border border-surfaceHighlight rounded-2xl p-6 hover:border-primary/50 transition-all duration-300 group">
                                {/* Step Number */}
                                <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-primary/20 to-purple-500/20 mb-4 group-hover:from-primary group-hover:to-purple-500 transition-all duration-300">
                                    {step.number}
                                </div>

                                {/* Icon */}
                                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                                    <step.icon className="w-6 h-6 text-primary" />
                                </div>

                                {/* Content */}
                                <h3 className="text-xl font-bold text-white mb-2">
                                    {step.title}
                                </h3>
                                <p className="text-sm text-text-muted">
                                    {step.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Stats Section */}
            <div className="bg-gradient-to-br from-primary/10 via-purple-500/10 to-pink-500/10 border border-primary/20 rounded-3xl p-12 backdrop-blur-sm">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                    <div>
                        <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500 mb-2">
                            5+
                        </div>
                        <div className="text-lg font-semibold text-white mb-1">Platforms Supported</div>
                        <div className="text-sm text-text-muted">Instagram, TikTok, LinkedIn, Twitter & YouTube</div>
                    </div>
                    <div>
                        <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500 mb-2">
                            &lt;15s
                        </div>
                        <div className="text-lg font-semibold text-white mb-1">Average Generation Time</div>
                        <div className="text-sm text-text-muted">From upload to complete social kit</div>
                    </div>
                    <div>
                        <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-primary mb-2">
                            ∞
                        </div>
                        <div className="text-lg font-semibold text-white mb-1">Creative Possibilities</div>
                        <div className="text-sm text-text-muted">Unlimited generations & variations</div>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="text-center mt-24">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                    Ready to Transform Your Content?
                </h2>
                <p className="text-lg text-text-muted mb-8 max-w-2xl mx-auto">
                    Join creators who are already using SnapKit to save hours and create better content.
                </p>
                <a
                    href="/"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary to-purple-600 hover:from-purple-600 hover:to-primary text-white font-bold rounded-xl shadow-lg shadow-primary/30 transition-all transform hover:scale-105"
                >
                    <Icons.Sparkles className="w-5 h-5" />
                    Start Creating Now
                </a>
            </div>
        </div>
    );
};
