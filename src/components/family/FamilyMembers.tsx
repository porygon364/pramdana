import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Plus, Trash2, MessageCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/lib/supabase';

interface FamilyMember {
  id: string;
  name: string;
  whatsapp_number: string;
}

const FamilyMembers = () => {
  const { toast } = useToast();
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [loading, setLoading] = useState(false);
  const [newMember, setNewMember] = useState({ name: '', whatsapp_number: '' });

  useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('family_members')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMembers(data || []);
    } catch (error) {
      console.error('Error loading family members:', error);
      toast({
        title: "Error",
        description: "Failed to load family members",
        variant: "destructive",
      });
    }
  };

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMember.name || !newMember.whatsapp_number) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { error } = await supabase
        .from('family_members')
        .insert({
          user_id: user.id,
          name: newMember.name,
          whatsapp_number: newMember.whatsapp_number,
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Family member added successfully!",
      });

      setNewMember({ name: '', whatsapp_number: '' });
      loadMembers();
    } catch (error) {
      console.error('Error adding family member:', error);
      toast({
        title: "Error",
        description: "Failed to add family member",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMember = async (id: string) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('family_members')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Family member removed successfully!",
      });

      loadMembers();
    } catch (error) {
      console.error('Error deleting family member:', error);
      toast({
        title: "Error",
        description: "Failed to remove family member",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsAppMessage = (number: string) => {
    const message = encodeURIComponent("Hi! I've added you to my expense sharing group on Union.");
    window.open(`https://wa.me/${number}?text=${message}`, '_blank');
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Add Family Member</h2>
        <form onSubmit={handleAddMember} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={newMember.name}
                onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="whatsapp">WhatsApp Number</Label>
              <Input
                id="whatsapp"
                value={newMember.whatsapp_number}
                onChange={(e) => setNewMember({ ...newMember, whatsapp_number: e.target.value })}
                placeholder="e.g., 628123456789"
                required
              />
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            <Plus className="h-4 w-4 mr-2" />
            Add Member
          </Button>
        </form>
      </Card>

      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Family Members</h2>
        <div className="space-y-4">
          {members.map((member) => (
            <div
              key={member.id}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div>
                <h3 className="font-medium">{member.name}</h3>
                <p className="text-sm text-muted-foreground">{member.whatsapp_number}</p>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleWhatsAppMessage(member.whatsapp_number)}
                >
                  <MessageCircle className="h-4 w-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => handleDeleteMember(member.id)}
                  disabled={loading}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
          {members.length === 0 && (
            <p className="text-center text-muted-foreground">No family members added yet</p>
          )}
        </div>
      </Card>
    </div>
  );
};

export default FamilyMembers; 