
import React, { useState } from "react";
import { 
  CheckCircle, 
  Plus,
  Droplets,
  Dumbbell,
  BookOpen,
  BedDouble,
  Coffee,
  X
} from "lucide-react";
import StreakBadge from "./StreakBadge";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useHabitsStorage } from "@/hooks/use-habits-storage";

// Sample habit categories and their associated icons
const habitCategories = [
  { id: "health", name: "Health", color: "text-green-500" },
  { id: "fitness", name: "Fitness", color: "text-orange-500" },
  { id: "learning", name: "Learning", color: "text-blue-500" },
  { id: "sleep", name: "Sleep", color: "text-purple-500" },
  { id: "mindfulness", name: "Mindfulness", color: "text-teal-500" },
];

// Icons mapping for the habit categories
const categoryIcons = {
  "health": Droplets,
  "fitness": Dumbbell,
  "learning": BookOpen,
  "sleep": BedDouble,
  "mindfulness": Coffee,
};

const HabitTracker: React.FC = () => {
  const { habits, addHabit, toggleHabit } = useHabitsStorage();
  const [isAddHabitOpen, setIsAddHabitOpen] = useState(false);
  const [newHabit, setNewHabit] = useState({ name: "", category: "" });

  const getCategoryColor = (categoryId: string) => {
    const category = habitCategories.find(c => c.id === categoryId);
    return category?.color || "text-gray-500";
  };

  const getIconForCategory = (categoryId: string) => {
    return categoryIcons[categoryId as keyof typeof categoryIcons] || Coffee;
  };

  const handleAddHabit = () => {
    if (!newHabit.name.trim() || !newHabit.category) {
      toast.error("Please fill in all required fields");
      return;
    }

    addHabit({
      name: newHabit.name,
      category: newHabit.category,
    });

    setNewHabit({ name: "", category: "" });
    setIsAddHabitOpen(false);
    toast.success("New habit added successfully");
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {habits.map(habit => {
          const IconComponent = getIconForCategory(habit.category);
          return (
            <div 
              key={habit.id}
              className="group relative bg-card rounded-xl border p-4 shadow-subtle hover-scale overflow-hidden"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => toggleHabit(habit.id)}
                    className={cn(
                      "h-10 w-10 rounded-full flex items-center justify-center transition-all duration-300",
                      habit.completed 
                        ? "bg-primary/10 text-primary" 
                        : "bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary"
                    )}
                  >
                    <IconComponent className="h-5 w-5" />
                  </button>
                  <div>
                    <h3 className="font-medium">{habit.name}</h3>
                    <span className={`text-xs ${getCategoryColor(habit.category)}`}>
                      {habitCategories.find(c => c.id === habit.category)?.name}
                    </span>
                  </div>
                </div>
                
                <StreakBadge count={habit.streak} />
              </div>
              
              {/* Progress indicator bar at bottom */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-muted overflow-hidden">
                <div 
                  className={cn(
                    "h-full transition-all duration-500 ease-out",
                    habit.completed ? "bg-primary" : "bg-primary/20 group-hover:bg-primary/40"
                  )}
                  style={{ width: `${(habit.streak / 30) * 100}%` }}
                />
              </div>
            </div>
          );
        })}
        
        {/* Add New Habit Card */}
        <div 
          className="bg-card/50 rounded-xl border border-dashed p-4 flex items-center justify-center hover-scale cursor-pointer"
          onClick={() => setIsAddHabitOpen(true)}
        >
          <div className="flex flex-col items-center text-muted-foreground">
            <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center mb-2">
              <Plus className="h-5 w-5" />
            </div>
            <span className="text-sm font-medium">Add New Habit</span>
          </div>
        </div>
      </div>

      {/* Add Habit Dialog */}
      <Dialog open={isAddHabitOpen} onOpenChange={setIsAddHabitOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Habit</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="habit-name">Habit Name</Label>
              <Input 
                id="habit-name" 
                value={newHabit.name} 
                onChange={(e) => setNewHabit({...newHabit, name: e.target.value})}
                placeholder="e.g., Drink Water, Exercise, Meditate"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="habit-category">Category</Label>
              <Select 
                value={newHabit.category} 
                onValueChange={(value) => setNewHabit({...newHabit, category: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {habitCategories.map(category => (
                    <SelectItem key={category.id} value={category.id}>
                      <div className="flex items-center">
                        <span className={`mr-2 ${category.color}`}>
                          {category.name}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddHabitOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddHabit}>Add Habit</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HabitTracker;
