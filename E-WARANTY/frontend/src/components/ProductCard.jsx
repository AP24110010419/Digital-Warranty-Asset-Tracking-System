import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Edit } from 'lucide-react';
import { WarrantyBadge } from './WarrantyBadge.jsx';
import { formatDistanceToNow } from 'date-fns';

export const ProductCard = ({ product, onDelete }) => {
  const warranty = product.warranty;
  const canEdit = product.editCount < 2;

  return (
    <div className="glass glass-strong card-hover p-6 rounded-[1.5rem] border border-slate-700/50 shadow-xl shadow-slate-950/20">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white mb-1">{product.name}</h3>
          <p className="text-sm text-slate-400">{product.category}</p>
        </div>
        <div className="flex gap-2">
          <Link
            to={`/product/${product._id}/edit`}
            className={`p-2 rounded-lg transition-colors ${
              canEdit
                ? 'text-amber-400 hover:bg-slate-700/50 hover:text-amber-300'
                : 'text-slate-500 cursor-not-allowed opacity-50'
            }`}
            onClick={(e) => !canEdit && e.preventDefault()}
            title={canEdit ? 'Edit product' : 'Edit limit reached (2 edits max)'}
          >
            <Edit className="w-5 h-5" />
          </Link>
          <button
            onClick={() => onDelete(product._id)}
            className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors text-red-400 hover:text-red-300"
            title="Delete product"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="space-y-3 mb-4">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <p className="text-slate-400">Price</p>
            <p className="text-white font-semibold">₹{product.purchasePrice?.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-slate-400">Purchase Date</p>
            <p className="text-white text-sm">
              {new Date(product.purchaseDate).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      {warranty && (
        <div className="border-t border-slate-700/50 pt-3">
          <WarrantyBadge status={warranty.status} daysRemaining={warranty.daysRemaining} />
          <p className="text-xs text-slate-400 mt-2">
            Expires: {new Date(warranty.expiryDate).toLocaleDateString()}
          </p>
        </div>
      )}
    </div>
  );
};
