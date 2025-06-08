'use client'

import { useEffect, useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './table'
import { Input } from './input'
import { Loader2 } from 'lucide-react'

interface DataTableProps<T> {
  columns: any[]
  data: T[]
  loading?: boolean
  pagination?: boolean
  searchPlaceholder?: string
}

export function DataTable<T>({
  columns,
  data,
  loading = false,
  pagination = false,
  searchPlaceholder = 'Rechercher...'
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredData, setFilteredData] = useState<T[]>(data)
  const [pageSize, setPageSize] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)

  // Mettre à jour les données filtrées lorsque les données ou la recherche changent
  useEffect(() => {
    setFilteredData(data)
  }, [data])

  // Afficher l'état de chargement
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Chargement des données...</p>
      </div>
    )
  }

  // Afficher un message si aucune donnée n'est disponible
  if (!data || data.length === 0) {
    return (
      <div className="border rounded-md p-8 text-center">
        <p className="text-muted-foreground">Aucune donnée disponible</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column: any) => (
                <TableHead key={column.id}>{column.header}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((row: any, rowIndex: number) => (
              <TableRow key={rowIndex}>
                {columns.map((column: any) => (
                  <TableCell key={column.id}>
                    {column.cell ? column.cell({ row: { original: row } }) : row[column.id]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
} 


