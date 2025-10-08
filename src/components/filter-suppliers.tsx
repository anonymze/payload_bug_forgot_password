'use client'

import React from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'

const FilterSuppliers: React.FC = () => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  
  const currentFilter = searchParams.get('where[selection.selection][equals]')
  const scpiFilter = searchParams.get('category') 
  const epargneFilter = searchParams.get('where[other_information.epargne][equals]')
  
  const handleFilterChange = (filterType: string, value?: string) => {
    const params = new URLSearchParams(searchParams.toString())
    
    // Clear all existing filters first
    params.delete('where[selection.selection][equals]')
    params.delete('where[other_information.epargne][equals]')
    params.delete('category')
    params.delete('page') // Reset to first page
    
    // Apply new filter based on type
    switch (filterType) {
      case 'selection':
        if (value === 'true') {
          params.set('where[selection.selection][equals]', 'true')
        }
        break
      case 'epargne':
        if (value === 'true') {
          params.set('where[other_information.epargne][equals]', 'true')
        }
        break
      case 'scpi':
        if (value === 'scpi') {
          // For SCPI, we'll use a custom approach since it involves relationships
          params.set('category', 'scpi')
        }
        break
      case 'all':
      default:
        // No filters - show all
        break
    }
    
    router.push(`${pathname}?${params.toString()}`)
  }
  
  const getActiveFilter = () => {
    if (currentFilter === 'true') return 'selection'
    if (epargneFilter === 'true') return 'epargne' 
    if (scpiFilter === 'scpi') return 'scpi'
    return 'all'
  }
  
  const activeFilter = getActiveFilter()
  
  const filterOptions = [
    { key: 'all', label: 'Tous les fournisseurs', count: null },
    { key: 'scpi', label: 'Fournisseurs SCPI', count: null },
    { key: 'epargne', label: 'Fournisseurs Épargne', count: null },
    { key: 'selection', label: 'Notre sélection', count: null }
  ]
  
  return (
    <div style={{ 
      padding: '16px 24px', 
      borderBottom: '1px solid var(--theme-elevation-200)',
      backgroundColor: 'var(--theme-elevation-50)',
      marginBottom: '16px'
    }}>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center',
        gap: '16px',
        marginBottom: '12px' 
      }}>
        <h4 style={{ 
          margin: '0', 
          fontSize: '14px', 
          fontWeight: '600',
          color: 'var(--theme-text)'
        }}>
          Filtrer les fournisseurs:
        </h4>
        
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {filterOptions.map((option) => (
            <button
              key={option.key}
              onClick={() => {
                if (option.key === 'all') {
                  handleFilterChange('all')
                } else {
                  handleFilterChange(option.key, option.key === 'scpi' ? 'scpi' : 'true')
                }
              }}
              style={{
                padding: '6px 12px',
                border: `1px solid ${activeFilter === option.key ? 'var(--theme-success-500)' : 'var(--theme-elevation-400)'}`,
                borderRadius: '4px',
                backgroundColor: activeFilter === option.key ? 'var(--theme-success-500)' : 'var(--theme-elevation-0)',
                color: activeFilter === option.key ? 'white' : 'var(--theme-text)',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: activeFilter === option.key ? '600' : '400',
                transition: 'all 0.2s ease'
              }}
            >
              {option.label}
              {option.count && ` (${option.count})`}
            </button>
          ))}
        </div>
      </div>
      
      {activeFilter !== 'all' && (
        <div style={{ 
          fontSize: '12px', 
          color: 'var(--theme-text-dim)',
          fontStyle: 'italic'
        }}>
          Filtre actif: {filterOptions.find(f => f.key === activeFilter)?.label}
        </div>
      )}
    </div>
  )
}

export default FilterSuppliers
