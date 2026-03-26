"use client";

import { useState } from "react";
import { Share2, Copy, Check, QrCode, ExternalLink } from "lucide-react";
import { Button } from "@/components/user/Button";
import { Card } from "@/components/ui/card";

interface ShareShopCardProps {
  shopName: string;
  shopSlug: string;
}

export function ShareShopCard({ shopName, shopSlug }: ShareShopCardProps) {
  const [copied, setCopied] = useState(false);
  
  // In a real production app, this would use the real domain
  const publicUrl = `${typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'}/s/${shopSlug}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(publicUrl)}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="overflow-hidden border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white">
      <div className="p-6">
        <div className="flex flex-col md:flex-row gap-8 items-center">
          {/* QR Code Section */}
          <div className="flex-shrink-0">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center">
                <div className="w-40 h-40 bg-gray-50 rounded-xl flex items-center justify-center overflow-hidden mb-3">
                  <img 
                    src={qrCodeUrl} 
                    alt="Shop QR Code" 
                    className="w-full h-full object-contain p-2"
                  />
                </div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                  <QrCode className="w-3 h-3" /> Scan to Print
                </p>
              </div>
            </div>
          </div>

          {/* Text and Actions Section */}
          <div className="flex-1 text-center md:text-left space-y-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">Share Your Shop</h2>
              <p className="text-sm text-gray-500 max-w-md">
                Customers can scan this QR code or use the link below to upload files and place print orders directly to <span className="font-semibold text-indigo-600">{shopName}</span>.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="flex-1 w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 flex items-center justify-between group">
                <span className="text-sm font-medium text-gray-600 truncate mr-4">
                  {publicUrl}
                </span>
                <button 
                  onClick={copyToClipboard}
                  className="p-2 hover:bg-gray-200 rounded-lg transition-colors text-gray-400 hover:text-indigo-600"
                  title="Copy Link"
                >
                  {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2">
              <Button 
                variant="secondary" 
                size="sm" 
                onClick={() => window.open(publicUrl, '_blank')}
                icon={<ExternalLink className="w-4 h-4" />}
              >
                Open Shop
              </Button>
              <Button 
                variant="secondary" 
                size="sm" 
                onClick={() => window.print()}
                icon={<QrCode className="w-4 h-4" />}
              >
                Print QR Code
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom accent bar */}
      <div className="h-1 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
    </Card>
  );
}
