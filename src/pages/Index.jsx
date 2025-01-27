import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe, ChevronDown, Plus, X, Edit, Trash, Lock, Book, Wrench, DollarSign } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useDomains, useAddDomain, useUpdateDomain, useDeleteDomain } from '@/integrations/supabase';

// Define domain types and associated icons
const domainTypes = [
  { name: 'Trust', icon: Lock },
  { name: 'Knowledge', icon: Book },
  { name: 'Tools', icon: Wrench },
  { name: 'Exchange', icon: DollarSign },
];

// Define default particles for each domain type
const defaultParticles = {
  Trust: ['Security Protocol', 'Identity Verification', 'Trust Score'],
  Knowledge: ['Learning Path', 'Webinar', 'Information Sharing'],
  Tools: ['Task Management', 'Timeline', 'Resource Allocation'],
  Exchange: ['Payment Processing', 'Service Listing', 'Reviews'],
};

const Index = () => {
  const { data: domains, isLoading, isError } = useDomains();
  const addDomainMutation = useAddDomain();
  const updateDomainMutation = useUpdateDomain();
  const deleteDomainMutation = useDeleteDomain();

  const [newDomain, setNewDomain] = useState({ name: '', type: '' });
  const [perspectives, setPerspectives] = useState(['Default', 'Efficiency', 'Reliability', 'Ease of Use']);
  const [selectedPerspective, setSelectedPerspective] = useState('Default');
  const [newPerspective, setNewPerspective] = useState('');
  const [editingDomain, setEditingDomain] = useState(null);

  const { toast } = useToast();

  useEffect(() => {
    console.log('Domains:', domains);
  }, [domains]);

  const addDomain = async () => {
    if (newDomain.name.trim() !== '' && newDomain.type !== '') {
      try {
        const newDomainData = {
          domain_name: newDomain.name.trim(),
          description: `A ${newDomain.type} domain`,
          perspectives: {
            Default: defaultParticles[newDomain.type].reduce((acc, particle) => {
              acc[particle] = 'Not configured';
              return acc;
            }, {})
          }
        };
        console.log('Adding domain:', newDomainData);
        await addDomainMutation.mutateAsync(newDomainData);
        setNewDomain({ name: '', type: '' });
        toast({
          title: "Domain added",
          description: `${newDomain.name} has been added successfully.`,
        });
      } catch (error) {
        console.error('Error adding domain:', error);
        toast({
          title: "Error",
          description: "Failed to add domain. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const updateDomain = async (id, updatedDomain) => {
    try {
      await updateDomainMutation.mutateAsync({ id, ...updatedDomain });
      setEditingDomain(null);
      toast({
        title: "Domain updated",
        description: `${updatedDomain.domain_name} has been updated successfully.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update domain. Please try again.",
        variant: "destructive",
      });
    }
  };

  const deleteDomain = async (id) => {
    try {
      await deleteDomainMutation.mutateAsync(id);
      toast({
        title: "Domain deleted",
        description: "The domain has been deleted successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete domain. Please try again.",
        variant: "destructive",
      });
    }
  };

  const addPerspective = () => {
    if (newPerspective.trim() !== '' && !perspectives.includes(newPerspective.trim())) {
      setPerspectives([...perspectives, newPerspective.trim()]);
      setNewPerspective('');
    }
  };

  const removePerspective = (perspective) => {
    if (perspective !== 'Default') {
      setPerspectives(perspectives.filter(p => p !== perspective));
      if (selectedPerspective === perspective) {
        setSelectedPerspective('Default');
      }
    }
  };

  // Check loading and error states
  if (isLoading) return <div className="text-center mt-8">Loading domains...</div>;
  if (isError) return <div className="text-center mt-8 text-red-500">Error loading domains</div>;

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <h1 className="text-4xl font-bold mb-8 text-center">Domain Navigator</h1>
      {domains && domains.length > 0 ? (
      
      <div className="max-w-4xl mx-auto">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Add New Domain</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-2">
              <Input
                type="text"
                placeholder="Enter domain name"
                value={newDomain.name}
                onChange={(e) => setNewDomain({ ...newDomain, name: e.target.value })}
                className="flex-grow"
              />
              <Select value={newDomain.type} onValueChange={(value) => setNewDomain({ ...newDomain, type: value })}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {domainTypes.map((type) => (
                    <SelectItem key={type.name} value={type.name}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={addDomain}>Add Domain</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Manage Perspectives</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-2 mb-4">
              <Input
                type="text"
                placeholder="New perspective name"
                value={newPerspective}
                onChange={(e) => setNewPerspective(e.target.value)}
                className="flex-grow"
              />
              <Button onClick={addPerspective}>Add</Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {perspectives.map((perspective) => (
                <div key={perspective} className="flex items-center bg-gray-200 rounded-full px-3 py-1">
                  <span>{perspective}</span>
                  {perspective !== 'Default' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="ml-2 p-0"
                      onClick={() => removePerspective(perspective)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="mb-4">
          <Select value={selectedPerspective} onValueChange={setSelectedPerspective}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a perspective" />
            </SelectTrigger>
            <SelectContent>
              {perspectives.map((perspective) => (
                <SelectItem key={perspective} value={perspective}>
                  {perspective}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {domains.map((domain) => {
            const DomainIcon = domainTypes.find(type => type.name === domain.description.split(' ')[1])?.icon || Globe;
            return (
              <AccordionItem key={domain.id} value={`item-${domain.id}`}>
                <AccordionTrigger className="hover:no-underline">
                  <Card className="w-full bg-white hover:shadow-lg transition-shadow">
                    <CardContent className="flex items-center p-4">
                      <DomainIcon className="h-6 w-6 mr-2 text-blue-500" />
                      <span className="text-lg font-medium">{domain.domain_name}</span>
                      <ChevronDown className="h-4 w-4 ml-auto" />
                    </CardContent>
                  </Card>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="p-4 bg-gray-50 rounded-b-lg">
                    {domain.perspectives && domain.perspectives[selectedPerspective] ? (
                      Object.entries(domain.perspectives[selectedPerspective]).map(([particle, value]) => (
                        <p key={particle}><strong>{particle}:</strong> {value}</p>
                      ))
                    ) : (
                      <p>No data available for the selected perspective.</p>
                    )}
                    <div className="mt-4 flex justify-end space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" onClick={() => setEditingDomain(domain)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Edit Domain: {domain.domain_name}</DialogTitle>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            {domain.perspectives && domain.perspectives[selectedPerspective] && Object.entries(domain.perspectives[selectedPerspective]).map(([particle, value]) => (
                              <div key={particle} className="grid grid-cols-4 items-center gap-4">
                                <label htmlFor={particle}>{particle}</label>
                                <Input
                                  id={particle}
                                  value={editingDomain?.perspectives[selectedPerspective]?.[particle] || ''}
                                  onChange={(e) => setEditingDomain({
                                    ...editingDomain,
                                    perspectives: {
                                      ...editingDomain.perspectives,
                                      [selectedPerspective]: {
                                        ...editingDomain.perspectives[selectedPerspective],
                                        [particle]: e.target.value
                                      }
                                    }
                                  })}
                                  className="col-span-3"
                                />
                              </div>
                            ))}
                          </div>
                          <Button onClick={() => updateDomain(domain.id, editingDomain)}>Save Changes</Button>
                        </DialogContent>
                      </Dialog>
                      <Button variant="destructive" size="sm" onClick={() => deleteDomain(domain.id)}>
                        <Trash className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      ) : (
        <div className="text-center mt-8">No domains found. Add a new domain to get started.</div>
      )}
      </div>
    </div>
  );
};

export default Index;
