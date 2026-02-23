import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, UtensilsCrossed } from 'lucide-react';
import type { FamilyRaya } from '../backend';

interface FamilyCardProps {
  family: FamilyRaya;
}

export default function FamilyCard({ family }: FamilyCardProps) {
  return (
    <Card className="shadow-soft hover:shadow-soft-lg transition-all duration-300 animate-fade-in">
      <CardHeader>
        <CardTitle className="text-lg text-primary flex items-center gap-2">
          <Users className="w-5 h-5" />
          {family.familyName}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm">
          <span className="font-semibold text-foreground">Bilangan Ahli:</span>
          <span className="text-muted-foreground">{family.members.length} orang</span>
        </div>
        <div className="flex items-start gap-2 text-sm">
          <UtensilsCrossed className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
          <div>
            <span className="font-semibold text-foreground">Makanan:</span>
            <span className="text-muted-foreground ml-1">{family.platter}</span>
          </div>
        </div>
        <div className="border-t border-border pt-3">
          <p className="text-sm font-semibold text-foreground mb-2">Ahli Keluarga:</p>
          <ul className="space-y-1">
            {family.members.map((member, index) => (
              <li key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-accent"></span>
                {member}
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
