'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { CartProvider } from './cart-context';

export type Language = 'vn' | 'en';
export type ThemeMode = 'light' | 'dark';

const translations = {
    vn: {
        welcomeTitle: 'Chào mừng đến với Máy Bán Thuốc Tự Động',
        welcomeDescription: 'Chọn ngôn ngữ và chủ đề, sau đó tiếp tục đến trang danh sách thuốc.',
        selectLanguage: 'Ngôn ngữ',
        selectTheme: 'Giao diện',
        languageVietnamese: 'Tiếng Việt',
        languageEnglish: 'English',
        themeLight: 'Sáng',
        themeDark: 'Tối',
        startShopping: 'Bắt đầu mua sắm',
        adminPage: 'Trang quản trị',
        currentSettings: 'Cài đặt hiện tại',
        listPlaceholderTitle: 'Trang danh sách thuốc sắp ra mắt',
        listPlaceholderDescription: 'Phần này sẽ hiển thị danh sách thuốc dạng lưới và giỏ hàng.',
        backToWelcome: 'Trở về trang chào mừng',
        adminTitle: 'Quản lý Admin',
        manageMedicines: 'Quản lý thuốc',
        viewOrders: 'Xem đơn hàng',
        addNewMedicine: 'Thêm thuốc mới',
        editMedicine: 'Sửa thuốc',
        save: 'Lưu',
        cancel: 'Hủy',
        delete: 'Xóa',
        noOrders: 'Chưa có đơn hàng nào',
        orderId: 'ID Đơn',
        phoneNumber: 'Số điện thoại',
        totalPrice: 'Tổng tiền',
        qrContent: 'Mã QR',
        timestamp: 'Thời gian',
        actions: 'Hành động',
        loading: 'Đang tải dữ liệu...',
        addToCart: 'Thêm vào giỏ',
        removeFromCart: 'Xóa khỏi giỏ',
        viewDetails: 'Xem chi tiết',
        checkout: 'Thanh toán',
        emptyCart: 'Giỏ hàng trống',
        cartTotal: 'Tổng giỏ hàng',
        receiveOrder: 'Nhận hàng',
        orderSummary: 'Hóa đơn đơn hàng',
        price: 'Giá',
        quantity: 'Số lượng',
        subtotal: 'Tạm tính',
        lastOrder: 'Đơn hàng của bạn',
        medicineName: 'Tên thuốc',
        imageUrl: 'URL hình ảnh',
        dosage: 'Liều lượng',
        uses: 'Công dụng',
        pharmacology: 'Dược lý',
        indications: 'Chỉ định',
        contraindications: 'Chống chỉ định',
        sideEffects: 'Tác dụng phụ',
        interactions: 'Tương tác',
        warnings: 'Cảnh báo',
        overdoseHandling: 'Xử lý quá liều',
    },
    en: {
        welcomeTitle: 'Welcome to the medicine shop demo',
        welcomeDescription: 'Choose language and theme, then continue to the medicine list page.',
        selectLanguage: 'Language',
        selectTheme: 'Theme',
        languageVietnamese: 'Vietnamese',
        languageEnglish: 'English',
        themeLight: 'Light',
        themeDark: 'Dark',
        startShopping: 'Start shopping',
        adminPage: 'Admin page',
        currentSettings: 'Current settings',
        listPlaceholderTitle: 'Medicine list page coming soon',
        listPlaceholderDescription: 'This area will show the medicine grid and shopping cart.',
        backToWelcome: 'Back to welcome page',
        adminTitle: 'Admin Management',
        manageMedicines: 'Manage Medicines',
        viewOrders: 'View Orders',
        addNewMedicine: 'Add New Medicine',
        editMedicine: 'Edit Medicine',
        save: 'Save',
        cancel: 'Cancel',
        delete: 'Delete',
        noOrders: 'No orders yet',
        orderId: 'Order ID',
        phoneNumber: 'Phone number',
        totalPrice: 'Total',
        qrContent: 'QR content',
        timestamp: 'Timestamp',
        actions: 'Actions',
        loading: 'Loading data...',
        addToCart: 'Add to cart',
        removeFromCart: 'Remove from cart',
        viewDetails: 'View details',
        checkout: 'Checkout',
        emptyCart: 'Empty cart',
        cartTotal: 'Cart total',
        receiveOrder: 'Receive order',
        orderSummary: 'Order summary',
        price: 'Price',
        quantity: 'Quantity',
        subtotal: 'Subtotal',
        lastOrder: 'Your order',
        medicineName: 'Medicine name',
        imageUrl: 'Image URL',
        dosage: 'Dosage',
        uses: 'Uses',
        pharmacology: 'Pharmacology',
        indications: 'Indications',
        contraindications: 'Contraindications',
        sideEffects: 'Side effects',
        interactions: 'Interactions',
        warnings: 'Warnings',
        overdoseHandling: 'Overdose handling',
    },
};

export interface AppSettings {
    language: Language;
    theme: ThemeMode;
    setLanguage: (language: Language) => void;
    setTheme: (theme: ThemeMode) => void;
    t: typeof translations.vn;
}

const AppSettingsContext = createContext<AppSettings | undefined>(undefined);

export function AppProviders({ children }: { children: React.ReactNode }) {
    const [language, setLanguageState] = useState<Language>(() => {
        if (typeof window !== 'undefined') {
            const saved = window.localStorage.getItem('appLanguage');
            return saved === 'en' ? 'en' : 'vn';
        }
        return 'vn';
    });
    const [theme, setThemeState] = useState<ThemeMode>(() => {
        if (typeof window !== 'undefined') {
            const saved = window.localStorage.getItem('appTheme');
            return saved === 'dark' ? 'dark' : 'light';
        }
        return 'light';
    });

    useEffect(() => {
        document.documentElement.lang = language === 'vn' ? 'vi' : 'en';
        document.documentElement.classList.toggle('dark', theme === 'dark');
        window.localStorage.setItem('appLanguage', language);
        window.localStorage.setItem('appTheme', theme);
    }, [language, theme]);

    const setLanguage = (lang: Language) => setLanguageState(lang);
    const setTheme = (mode: ThemeMode) => setThemeState(mode);

    const contextValue = useMemo(
        () => ({
            language,
            theme,
            setLanguage,
            setTheme,
            t: translations[language],
        }),
        [language, theme]
    );

    return (
        <AppSettingsContext.Provider value={contextValue}>
            <CartProvider>{children}</CartProvider>
        </AppSettingsContext.Provider>
    );
}

export function useAppSettings() {
    const context = useContext(AppSettingsContext);
    if (!context) {
        throw new Error('useAppSettings must be used within AppProviders');
    }
    return context;
}
