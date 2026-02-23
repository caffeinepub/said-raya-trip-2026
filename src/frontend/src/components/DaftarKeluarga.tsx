import { useState, useEffect } from 'react';
import { useAddFamily } from '../hooks/useFamilyMutations';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

export default function DaftarKeluarga() {
  const [namaKeluarga, setNamaKeluarga] = useState('');
  const [makanan, setMakanan] = useState('');
  const [bilanganAhli, setBilanganAhli] = useState<number | null>(null);
  const [namaAhli, setNamaAhli] = useState<string[]>([]);
  const addFamily = useAddFamily();

  useEffect(() => {
    if (bilanganAhli !== null) {
      setNamaAhli(Array(bilanganAhli).fill(''));
    } else {
      setNamaAhli([]);
    }
  }, [bilanganAhli]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!namaKeluarga.trim() || !makanan.trim() || bilanganAhli === null) {
      toast.error('Sila lengkapkan semua maklumat');
      return;
    }

    const allMembersFilled = namaAhli.every((nama) => nama.trim() !== '');
    if (!allMembersFilled) {
      toast.error('Sila masukkan nama semua ahli keluarga');
      return;
    }

    try {
      await addFamily.mutateAsync({
        familyName: namaKeluarga.trim(),
        platter: makanan.trim(),
        members: namaAhli.map((nama) => nama.trim()),
        createdAt: BigInt(Date.now() * 1000000),
      });

      toast.success('Data berjaya disimpan.');
      
      // Reset form
      setNamaKeluarga('');
      setMakanan('');
      setBilanganAhli(null);
      setNamaAhli([]);
    } catch (error) {
      toast.error('Gagal menyimpan data');
    }
  };

  return (
    <div className="flex justify-center">
      <Card className="w-full max-w-2xl shadow-soft-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-primary">Daftar Keluarga</CardTitle>
          <CardDescription>Sila lengkapkan maklumat keluarga anda</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="namaKeluarga" className="text-foreground">
                Nama Keluarga <span className="text-destructive">*</span>
              </Label>
              <Input
                id="namaKeluarga"
                value={namaKeluarga}
                onChange={(e) => setNamaKeluarga(e.target.value)}
                placeholder="Contoh: Keluarga Ahmad"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="makanan" className="text-foreground">
                Makanan Yang Akan Dibawa <span className="text-destructive">*</span>
              </Label>
              <Input
                id="makanan"
                value={makanan}
                onChange={(e) => setMakanan(e.target.value)}
                placeholder="Contoh: Nasi Lemak"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bilanganAhli" className="text-foreground">
                Bilangan Ahli Hadir <span className="text-destructive">*</span>
              </Label>
              <Select
                value={bilanganAhli?.toString() || ''}
                onValueChange={(value) => setBilanganAhli(parseInt(value))}
              >
                <SelectTrigger id="bilanganAhli">
                  <SelectValue placeholder="Pilih bilangan ahli" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num} orang
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {bilanganAhli !== null && bilanganAhli > 0 && (
              <div className="space-y-4 animate-slide-down">
                <div className="border-t border-accent/30 pt-4">
                  <h3 className="text-lg font-semibold text-primary mb-4">Nama Ahli Keluarga</h3>
                  <div className="space-y-3">
                    {namaAhli.map((nama, index) => (
                      <div
                        key={index}
                        className="space-y-2 animate-fade-in"
                        style={{ animationDelay: `${index * 0.08}s` }}
                      >
                        <Label htmlFor={`ahli-${index}`} className="text-foreground">
                          Nama Ahli {index + 1} <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id={`ahli-${index}`}
                          value={nama}
                          onChange={(e) => {
                            const newNamaAhli = [...namaAhli];
                            newNamaAhli[index] = e.target.value;
                            setNamaAhli(newNamaAhli);
                          }}
                          placeholder={`Nama ahli ke-${index + 1}`}
                          required
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              disabled={addFamily.isPending}
            >
              {addFamily.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                'Hantar'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
