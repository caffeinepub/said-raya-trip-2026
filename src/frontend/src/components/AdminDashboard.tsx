import { useState } from 'react';
import { useFamilies } from '../hooks/useFamilies';
import { useDeleteFamily, useResetFamilies } from '../hooks/useFamilyMutations';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import ConfirmationModal from './ConfirmationModal';
import { exportToExcel } from '../utils/excelExport';
import { toast } from 'sonner';
import { Search, Trash2, RefreshCw, Download } from 'lucide-react';

export default function AdminDashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [selectedFamily, setSelectedFamily] = useState<string | null>(null);

  const { data: families = [], isLoading } = useFamilies();
  const deleteFamily = useDeleteFamily();
  const resetFamilies = useResetFamilies();

  const filteredFamilies = families.filter((family) =>
    family.familyName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async () => {
    if (!selectedFamily) return;

    try {
      await deleteFamily.mutateAsync(selectedFamily);
      toast.success('Keluarga berjaya dipadam');
      setDeleteModalOpen(false);
      setSelectedFamily(null);
    } catch (error) {
      toast.error('Gagal memadam keluarga');
    }
  };

  const handleReset = async () => {
    try {
      await resetFamilies.mutateAsync();
      toast.success('Database berjaya direset');
      setResetModalOpen(false);
    } catch (error) {
      toast.error('Gagal mereset database');
    }
  };

  const handleExport = () => {
    try {
      exportToExcel(families);
      toast.success('Laporan berjaya dieksport');
    } catch (error) {
      toast.error('Gagal mengeksport laporan');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Memuatkan data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="shadow-soft-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-primary">Admin Dashboard</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search and Actions */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Cari keluarga..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleExport}
                variant="outline"
                className="border-accent text-accent hover:bg-accent/10"
                disabled={families.length === 0}
              >
                <Download className="mr-2 h-4 w-4" />
                Export CSV
              </Button>
              <Button
                onClick={() => setResetModalOpen(true)}
                variant="destructive"
                disabled={families.length === 0}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Reset Database
              </Button>
            </div>
          </div>

          {/* Table */}
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-semibold">Nama Keluarga</TableHead>
                  <TableHead className="font-semibold">Makanan</TableHead>
                  <TableHead className="font-semibold">Bilangan Ahli</TableHead>
                  <TableHead className="font-semibold">Ahli Keluarga</TableHead>
                  <TableHead className="font-semibold text-right">Tindakan</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFamilies.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      {searchQuery ? 'Tiada keluarga dijumpai' : 'Tiada data'}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredFamilies.map((family) => (
                    <TableRow key={family.familyName}>
                      <TableCell className="font-medium">{family.familyName}</TableCell>
                      <TableCell>{family.platter}</TableCell>
                      <TableCell>{family.members.length}</TableCell>
                      <TableCell>
                        <div className="max-w-xs">
                          {family.members.join(', ')}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedFamily(family.familyName);
                            setDeleteModalOpen(true);
                          }}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        title="Padam Keluarga"
        message={`Adakah anda pasti mahu memadam keluarga "${selectedFamily}"? Tindakan ini tidak boleh dibatalkan.`}
        onConfirm={handleDelete}
        confirmText="Padam"
        isLoading={deleteFamily.isPending}
      />

      {/* Reset Confirmation Modal */}
      <ConfirmationModal
        open={resetModalOpen}
        onOpenChange={setResetModalOpen}
        title="Reset Database"
        message="Adakah anda pasti mahu mereset semua data? Semua maklumat keluarga akan dipadam. Tindakan ini tidak boleh dibatalkan."
        onConfirm={handleReset}
        confirmText="Reset"
        isLoading={resetFamilies.isPending}
      />
    </div>
  );
}
