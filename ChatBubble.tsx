
import React from 'react';
import { Message, Product } from '../types';
import { BUSINESS_INFO, EMI_BANKS } from '../constants';

interface ChatBubbleProps {
  message: Message;
  onCompare?: (p: Product) => void;
}

const ProductCard: React.FC<{ product: Product; onCompare?: (p: Product) => void }> = ({ product, onCompare }) => (
  <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 mb-2 relative">
    <div className="absolute top-2 left-2 z-10">
      <span className="bg-black text-white text-[8px] font-bold px-1.5 py-0.5 rounded uppercase">Used</span>
    </div>
    <img src={product.images[0].src} alt={product.name} className="w-full h-32 object-cover" />
    <div className="p-3">
      <h3 className="font-semibold text-gray-800 text-xs line-clamp-1 mb-1">{product.name}</h3>
      <div className="flex items-baseline justify-between mb-2">
        <span className="text-sm font-bold text-gray-900">৳{product.price.toLocaleString()}</span>
        <span className="text-[9px] text-green-600 font-bold">{product.stock_status === 'instock' ? 'In Stock' : 'Out of Stock'}</span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <a 
          href={product.permalink} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-center py-1.5 px-2 bg-yellow-400 text-black text-[10px] font-bold rounded-lg hover:bg-yellow-500 transition-colors"
        >
          Details
        </a>
        <button 
          onClick={() => onCompare?.(product)}
          className="py-1.5 px-2 border border-gray-200 text-gray-700 text-[10px] font-semibold rounded-lg hover:bg-gray-50 transition-colors"
        >
          Compare
        </button>
      </div>
    </div>
  </div>
);

export const ChatBubble: React.FC<ChatBubbleProps> = ({ message, onCompare }) => {
  const isUser = message.role === 'user';
  
  return (
    <div className={`flex w-full mb-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="w-7 h-7 rounded-full bg-yellow-400 flex items-center justify-center text-black font-bold text-[10px] mr-2 flex-shrink-0 border border-black/10">
          IT
        </div>
      )}
      <div className={`max-w-[85%] ${isUser ? 'order-1' : 'order-2'}`}>
        <div 
          className={`p-3 rounded-xl shadow-sm ${
            isUser 
              ? 'bg-black text-white rounded-tr-none' 
              : 'bg-white text-gray-800 rounded-tl-none border border-gray-100'
          }`}
        >
          <div className="text-xs whitespace-pre-line leading-relaxed">
            {message.content}
          </div>

          {message.type === 'emi-check' && (
            <div className="mt-3 space-y-2">
              <p className="font-bold text-[10px] text-gray-400 uppercase tracking-wider">EMI ব্যাংকসমূহ</p>
              <div className="flex flex-wrap gap-1">
                {EMI_BANKS.slice(0, 5).map(bank => (
                  <span key={bank} className="px-2 py-0.5 bg-gray-100 rounded text-[9px] text-gray-600 font-medium border border-gray-200">{bank}</span>
                ))}
              </div>
            </div>
          )}

          {message.type === 'store-info' && (
            <div className="mt-3 p-2 bg-gray-50 rounded-lg border border-gray-100">
              <p className="text-[10px] text-gray-600 mb-1 font-bold">IT Gallery Shop</p>
              <p className="text-[9px] text-gray-500 mb-2 leading-tight">{BUSINESS_INFO.address}</p>
              <a 
                href={BUSINESS_INFO.mapLink} 
                target="_blank" 
                className="block text-center py-1.5 bg-black text-white font-bold rounded-lg text-[10px] hover:bg-gray-800"
              >
                গুগল ম্যাপে দেখুন
              </a>
            </div>
          )}
        </div>

        {message.products && message.products.length > 0 && (
          <div className="mt-2 space-y-2">
            {message.products.map(product => (
              <ProductCard key={product.id} product={product} onCompare={onCompare} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
