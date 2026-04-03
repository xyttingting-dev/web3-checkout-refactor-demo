import React from 'react';
import { Store } from 'lucide-react';

/**
 * MerchantLogo
 *
 * Props:
 *   logoUrl      — 商户 logo 图片 URL（可选）
 *   merchantName — 商户名称，无 logoUrl 时取首字母作为 fallback（可选，默认 "Shopify Store"）
 *   brandColor   — 兜底色块背景色
 *
 * 渲染优先级：
 *   1. logoUrl 存在 → <img> 渲染真实 logo
 *   2. 无 logoUrl   → 矢量小房子图标 + brandColor 背景 fallback
 */

interface MerchantLogoProps {
    logoUrl?: string;
    merchantName?: string;
    brandColor?: string;
}

export const MerchantLogo: React.FC<MerchantLogoProps> = ({
    logoUrl,
    merchantName = 'Shopify Store',
    brandColor = 'linear-gradient(135deg, #1e1b4b 0%, #4c1d95 100%)',
}) => {
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
                /* ── Fallback: vector house icon ── */
                <div
                    style={{
                        width: '100%',
                        height: '100%',
                        background: brandColor,
                        borderRadius: 8,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.2), 0 2px 8px rgba(0,0,0,0.3)',
                    }}
                >
                    <Store
                        color="white"
                        strokeWidth={2.5}
                        style={{
                            width: '55%',
                            height: '55%',
                            filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.4))',
                            userSelect: 'none',
                        }}
                    />
                </div>
            )}
        </div>
    );
};
