import React from 'react';

export const PrivacyPolicy: React.FC = () => {
    return (
        <div className="min-h-screen pt-14 md:pt-24 pb-20 container mx-auto px-4 lg:px-8 max-w-[900px]">
            <div className="space-y-8 animate-fade-in">
                <div className="mb-12">
                    <h1 className="text-4xl font-bold text-white mb-4">Privacy Policy</h1>
                    <p className="text-text-muted">Last updated: December 14, 2025</p>
                </div>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-white">1. Information We Collect</h2>
                    <p className="text-text-muted leading-relaxed">
                        We collect information you provide directly to us, such as when you create an account, upload images, or communicate with us. This may include your email address, name, and any content you process through our service.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-white">2. How We Use Your Images</h2>
                    <p className="text-text-muted leading-relaxed">
                        Images uploaded to SnapKit are used solely for the purpose of generating content. We temporarily process your images to analyze them using AI models. Your images are not used to train our AI models without your explicit permission.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-white">3. Data Security</h2>
                    <p className="text-text-muted leading-relaxed">
                        We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no internet transmission is completely secure, and we cannot guarantee absolute security.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-white">4. API Key Storage</h2>
                    <p className="text-text-muted leading-relaxed">
                        Your API keys are encrypted and stored securely. We do not use your personal API keys for any purpose other than processing your specific requests.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-white">5. Contact Us</h2>
                    <p className="text-text-muted leading-relaxed">
                        If you have any questions about this Privacy Policy, please contact us at support@snapkit.com.
                    </p>
                </section>
            </div>
        </div>
    );
};
