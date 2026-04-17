'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { BookOpen, LogOut, Menu, X, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';

interface Course {
  id: string;
  title: string;
  description: string;
  progress: number;
}

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Add course state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newCourse, setNewCourse] = useState({ title: '', description: '', instructor: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    const role = localStorage.getItem('role');

    if (!token || !userId) {
      window.location.href = '/';
      return;
    }

    setUser({ userId, role });
    fetchCourses(token);
  }, []);

  const fetchCourses = async (token: string) => {
    try {
      const response = await fetch('/api/courses', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setCourses(data.courses || []);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('role');
    window.location.href = '/';
  };

  const handleAddCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const token = localStorage.getItem('token');
    
    try {
      const response = await fetch('/api/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(newCourse)
      });
      if (response.ok) {
        setIsAddOpen(false);
        setNewCourse({ title: '', description: '', instructor: '' });
        fetchCourses(token!);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCourse = async (e: React.MouseEvent, courseId: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!confirm("Haqiqatan ham bu kursni o'chirmoqchimisiz?")) return;
    
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`/api/courses/${courseId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        setCourses(courses.filter(c => c.id !== courseId));
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <BookOpen className="w-7 h-7 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">EduLearn</h1>
          </div>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          <div className="hidden md:flex items-center gap-4">
            <span className="text-gray-700 capitalize">
              {user?.role || 'User'}
            </span>
            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 px-4 py-3 space-y-2">
            <p className="text-gray-700 capitalize py-2">
              Role: {user?.role || 'User'}
            </p>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="w-full gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back!</h2>
            <p className="text-gray-600">Here&apos;s what you&apos;re learning</p>
          </div>
          
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4" /> Yangi Kurs qo'shish
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Yangi Kurs Yaratish</DialogTitle>
                <DialogDescription>Kurs haqida ma'lumotlarni kiriting.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddCourse} className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Sarlavha</Label>
                  <Input 
                    id="title" 
                    required 
                    value={newCourse.title}
                    onChange={(e) => setNewCourse({...newCourse, title: e.target.value})} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Ta'rif</Label>
                  <Textarea 
                    id="description" 
                    value={newCourse.description}
                    onChange={(e) => setNewCourse({...newCourse, description: e.target.value})} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="instructor">O'qituvchi</Label>
                  <Input 
                    id="instructor"
                    value={newCourse.instructor}
                    onChange={(e) => setNewCourse({...newCourse, instructor: e.target.value})} 
                  />
                </div>
                <DialogFooter className="pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>Bekor qilish</Button>
                  <Button type="submit" disabled={isSubmitting}>Saqlash</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading courses...</p>
          </div>
        ) : courses.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <BookOpen className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-600 text-lg">No courses enrolled yet</p>
              <p className="text-gray-500 text-sm mt-1">Enroll in a course to get started</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div key={course.id} className="relative group">
                <Link href={`/course/${course.id}`}>
                  <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer bg-white">
                    <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-t-lg pb-10">
                      <CardTitle className="text-lg pr-8">{course.title}</CardTitle>
                      <CardDescription className="text-blue-100 text-sm">
                        {course.description}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="pt-6 relative">
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium text-gray-700">Progress</span>
                            <span className="text-sm font-semibold text-blue-600">
                              {course.progress}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all"
                              style={{ width: `${course.progress}%` }}
                            ></div>
                          </div>
                        </div>

                        <Button
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                          size="sm"
                        >
                          Continue Learning
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
                <button 
                  onClick={(e) => handleDeleteCourse(e, course.id)}
                  className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-red-500 rounded-full text-white transition-colors z-10 opacity-0 group-hover:opacity-100 focus:opacity-100"
                  title="Kursni o'chirish"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
