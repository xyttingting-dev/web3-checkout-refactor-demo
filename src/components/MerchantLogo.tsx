import React from 'react';

/**
 * MerchantLogo
 *
 * Props:
 *   logoUrl      — 商户 logo 图片 URL（可选）
 *   merchantName — 商户名称，无 logoUrl 时取首字母作为 fallback（可选，默认 "Shopify Store"）
 *   brandColor   — 首字母块背景色（可选，默认 Shopify 绿 #96bf48）
 *
 * 渲染优先级：
 *   1. logoUrl 存在 → <img> 渲染真实 logo
 *   2. 无 logoUrl   → 首字母 + brandColor 背景 fallback
 */

interface MerchantLogoProps {
    logoUrl?: string;
    merchantName?: string;
    brandColor?: string;
}

export const MerchantLogo: React.FC<MerchantLogoProps> = ({
    logoUrl,
    merchantName = 'Shopify Store',
    brandColor = '#96bf48',
}) => {
    // Derive initial: take first char of first word, uppercase
    const initial = merchantName.trim().charAt(0).toUpperCase();

    return (
        <div
            style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            {logoUrl ? (
                /* ── Real logo path ── */
                <img
                    src={logoUrl}
                    alt={merchantName}
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                        borderRadius: 8,
                    }}
                />
            ) : (
                /* ── Fallback: initial letter ── */
                <div
                    style={{
                        width: '100%',
                        height: '100%',
                        background: brandColor,
                        borderRadius: 8,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                    }}
                >
                    <span
                        style={{
                            fontFamily: 'Georgia, "Times New Roman", serif',
                            fontWeight: 900,
                            color: 'white',
                            fontSize: '55%',   // scales with parent tile size (56px tile → ~31px, 64px tile → ~35px)
                            lineHeight: 1,
                            textShadow: '0 2px 6px rgba(0,0,0,0.25)',
                            userSelect: 'none',
                        }}
                    >
                        {initial}
                    </span>
                </div>
            )}
        </div>
    );
};
