import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Image from '../../../components/AppImage';

const NFTGallery = ({ nfts }) => {
  const [selectedNFT, setSelectedNFT] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  const totalValue = nfts.reduce((sum, nft) => sum + nft.value, 0);

  const handleNFTClick = (nft) => {
    setSelectedNFT(nft);
  };

  const closeModal = () => {
    setSelectedNFT(null);
  };

  return (
    <div className="space-y-6">
      {/* NFT Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-surface border border-border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <Icon name="Image" size={20} color="var(--color-primary)" />
            <h3 className="font-semibold text-text-primary">Total NFTs</h3>
          </div>
          <div className="text-2xl font-bold text-text-primary">{nfts.length}</div>
          <div className="text-sm text-text-secondary">Unique tokens</div>
        </div>

        <div className="bg-surface border border-border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <Icon name="DollarSign" size={20} color="var(--color-success)" />
            <h3 className="font-semibold text-text-primary">Total Value</h3>
          </div>
          <div className="text-2xl font-bold text-text-primary font-data">
            ${totalValue.toLocaleString()}
          </div>
          <div className="text-sm text-text-secondary">Estimated floor</div>
        </div>

        <div className="bg-surface border border-border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <Icon name="TrendingUp" size={20} color="var(--color-warning)" />
            <h3 className="font-semibold text-text-primary">Top Collection</h3>
          </div>
          <div className="text-lg font-bold text-text-primary">
            {nfts[0]?.collection || 'N/A'}
          </div>
          <div className="text-sm text-text-secondary">Highest value</div>
        </div>
      </div>

      {/* View Controls */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-text-primary">NFT Collection</h2>
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'grid' ? 'primary' : 'outline'}
            onClick={() => setViewMode('grid')}
            className="p-2"
          >
            <Icon name="Grid3X3" size={16} />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'primary' : 'outline'}
            onClick={() => setViewMode('list')}
            className="p-2"
          >
            <Icon name="List" size={16} />
          </Button>
        </div>
      </div>

      {/* NFT Grid */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {nfts.map((nft, index) => (
            <div
              key={index}
              onClick={() => handleNFTClick(nft)}
              className="bg-surface border border-border rounded-xl overflow-hidden hover:shadow-lg transition-all cursor-pointer group"
            >
              <div className="aspect-square overflow-hidden">
                <Image
                  src={nft.image}
                  alt={`${nft.collection} #${nft.tokenId}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-text-primary mb-1 truncate">
                  {nft.collection}
                </h3>
                <p className="text-sm text-text-secondary mb-2">#{nft.tokenId}</p>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-text-primary font-data">
                    ${nft.value.toLocaleString()}
                  </span>
                  <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <Icon name="ExternalLink" size={14} />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* NFT List */
        <div className="bg-surface border border-border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-surface-secondary">
                <tr>
                  <th className="text-left p-4 text-sm font-medium text-text-secondary">NFT</th>
                  <th className="text-left p-4 text-sm font-medium text-text-secondary">Collection</th>
                  <th className="text-right p-4 text-sm font-medium text-text-secondary">Value</th>
                  <th className="text-center p-4 text-sm font-medium text-text-secondary">Actions</th>
                </tr>
              </thead>
              <tbody>
                {nfts.map((nft, index) => (
                  <tr key={index} className="border-b border-border hover:bg-surface-secondary transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg overflow-hidden">
                          <Image
                            src={nft.image}
                            alt={`${nft.collection} #${nft.tokenId}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <div className="font-medium text-text-primary">#{nft.tokenId}</div>
                          <div className="text-sm text-text-secondary">Token ID</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="font-medium text-text-primary">{nft.collection}</div>
                    </td>
                    <td className="p-4 text-right">
                      <div className="font-bold text-text-primary font-data">
                        ${nft.value.toLocaleString()}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleNFTClick(nft)}>
                          <Icon name="Eye" size={14} />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Icon name="ExternalLink" size={14} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Empty State */}
      {nfts.length === 0 && (
        <div className="bg-surface border-2 border-dashed border-border rounded-xl p-12 text-center">
          <Icon name="Image" size={48} className="text-text-muted mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-text-primary mb-2">No NFTs Found</h3>
          <p className="text-text-secondary mb-4">
            Connect your wallet to view your NFT collection
          </p>
          <Button variant="outline">
            <Icon name="RefreshCw" size={16} className="mr-2" />
            Refresh Collection
          </Button>
        </div>
      )}

      {/* NFT Detail Modal */}
      {selectedNFT && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-text-primary">
                  {selectedNFT.collection} #{selectedNFT.tokenId}
                </h2>
                <Button variant="ghost" onClick={closeModal} className="p-2">
                  <Icon name="X" size={20} />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="aspect-square rounded-lg overflow-hidden">
                  <Image
                    src={selectedNFT.image}
                    alt={`${selectedNFT.collection} #${selectedNFT.tokenId}`}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-text-primary mb-2">Details</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-text-secondary">Collection:</span>
                        <span className="text-text-primary">{selectedNFT.collection}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-secondary">Token ID:</span>
                        <span className="text-text-primary">#{selectedNFT.tokenId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-secondary">Estimated Value:</span>
                        <span className="text-text-primary font-data">
                          ${selectedNFT.value.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button variant="primary" className="flex-1">
                      <Icon name="ExternalLink" size={16} className="mr-2" />
                      View on OpenSea
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <Icon name="Share" size={16} className="mr-2" />
                      Share
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NFTGallery;