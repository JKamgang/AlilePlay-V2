import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="bg-gray-900 text-gray-400 text-sm mt-12 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
                    <div>
                        <h4 className="font-bold text-white mb-2">Alileva, LLC</h4>
                        <p>Lead Designer: Jean Baptiste</p>
                        <p>Contact: Jean@alileva.com</p>
                        <p>Tel: +1 404 236 9347</p>
                        <p><a href="http://www.alileva.com" target="_blank" rel="noopener noreferrer" className="hover:text-brand-primary">www.alileva.com</a></p>
                    </div>
                    <div>
                        <h4 className="font-bold text-white mb-2">Legal Disclaimer</h4>
                        <p>This platform is provided "as is". Alileva, LLC is not responsible for user interactions. By using this service, you agree to our Terms of Use. Violation may result in account termination. Liability is limited to the amount invested by the user.</p>
                    </div>
                     <div>
                        <h4 className="font-bold text-white mb-2">Policies & Support</h4>
                        <ul className="space-y-1">
                            <li><a href="#" className="hover:text-brand-primary">Terms of Use</a></li>
                            <li><a href="#" className="hover:text-brand-primary">Privacy Policy</a></li>
                            <li><a href="#" className="hover:text-brand-primary">Community Guidelines</a></li>
                            <li><a href="#" className="hover:text-brand-primary">Interactive Manual</a></li>
                        </ul>
                    </div>
                </div>
                <div className="mt-8 pt-8 border-t border-gray-800 text-center">
                    <p>&copy; {new Date().getFullYear()} Alileva, LLC. All rights reserved. Platform design and concept by Jean Baptiste.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;