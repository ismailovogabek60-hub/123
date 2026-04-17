'use client';

import { useEffect, useState, use } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, ChevronLeft, Download, Upload, FileText } from 'lucide-react';
import Link from 'next/link';

interface Assignment {
  id: string;
  title: string;
  dueDate: string;
  status: 'pending' | 'submitted' | 'graded';
  grade?: number;
}

interface CourseDetail {
  id: string;
  title: string;
  description: string;
  instructor: string;
  assignments: Assignment[];
}

export default function CoursePage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const { id } = unwrappedParams;
  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/';
      return;
    }
    fetchCourse(token, id);
  }, [id]);

  const fetchCourse = async (token: string, courseId: string) => {
    try {
      const response = await fetch(`/api/courses/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setCourse(data);
      }
    } catch (error) {
      console.error('Error fetching course:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setUploadedFile(e.target.files[0]);
    }
  };

  const handleSubmitAssignment = async () => {
    if (!uploadedFile || !selectedAssignment) return;

    const token = localStorage.getItem('token');
    if (!token) return;

    const formData = new FormData();
    formData.append('file', uploadedFile);
    formData.append('assignmentId', selectedAssignment.id);

    try {
      const response = await fetch('/api/assignments/submit', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (response.ok) {
        alert('Assignment submitted successfully!');
        setUploadedFile(null);
        setSelectedAssignment(null);
        fetchCourse(token, course?.id || id);
      }
    } catch (error) {
      console.error('Error submitting assignment:', error);
      alert('Error submitting assignment');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'submitted':
        return 'bg-blue-100 text-blue-800';
      case 'graded':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/dashboard" className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4">
            <ChevronLeft className="w-5 h-5" />
            Back to Dashboard
          </Link>
          <div className="flex items-center gap-2">
            <BookOpen className="w-7 h-7 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">EduLearn</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading course...</p>
          </div>
        ) : course ? (
          <>
            {/* Course Header */}
            <Card className="mb-8 bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-0">
              <CardHeader>
                <CardTitle className="text-3xl">{course.title}</CardTitle>
                <CardDescription className="text-blue-100 text-lg">
                  Instructor: {course.instructor}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-blue-50">{course.description}</p>
              </CardContent>
            </Card>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Assignments Column */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Assignments</CardTitle>
                    <CardDescription>
                      {course.assignments.length} assignment{course.assignments.length !== 1 ? 's' : ''}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {course.assignments.length === 0 ? (
                      <p className="text-gray-500 text-center py-8">No assignments yet</p>
                    ) : (
                      <div className="space-y-4">
                        {course.assignments.map((assignment) => (
                          <div
                            key={assignment.id}
                            onClick={() => setSelectedAssignment(assignment)}
                            className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                              selectedAssignment?.id === assignment.id
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h3 className="font-semibold text-gray-900">
                                  {assignment.title}
                                </h3>
                                <p className="text-sm text-gray-600 mt-1">
                                  Due: {new Date(assignment.dueDate).toLocaleDateString()}
                                </p>
                              </div>
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(assignment.status)}`}>
                                {assignment.status}
                              </span>
                            </div>
                            {assignment.status === 'graded' && assignment.grade !== undefined && (
                              <div className="mt-2 pt-2 border-t border-gray-200">
                                <p className="text-sm font-semibold text-green-600">
                                  Grade: {assignment.grade}%
                                </p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Submission Panel */}
              <div>
                {selectedAssignment ? (
                  <Card className="sticky top-24">
                    <CardHeader>
                      <CardTitle className="text-lg">Submit Assignment</CardTitle>
                      <CardDescription>{selectedAssignment.title}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {selectedAssignment.status === 'graded' ? (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                          <p className="text-sm font-medium text-green-800 mb-2">
                            ✓ Assignment Graded
                          </p>
                          <p className="text-sm text-green-700">
                            Your score: {selectedAssignment.grade}%
                          </p>
                        </div>
                      ) : selectedAssignment.status === 'submitted' ? (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <p className="text-sm font-medium text-blue-800">
                            ✓ Already Submitted
                          </p>
                          <p className="text-sm text-blue-700 mt-1">
                            Waiting for grading
                          </p>
                        </div>
                      ) : (
                        <>
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                            <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                            <input
                              type="file"
                              onChange={handleFileChange}
                              className="block w-full text-sm text-gray-500
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-md file:border-0
                                file:text-sm file:font-semibold
                                file:bg-blue-50 file:text-blue-700
                                hover:file:bg-blue-100"
                            />
                            {uploadedFile && (
                              <p className="text-sm text-green-600 mt-2 font-medium">
                                {uploadedFile.name}
                              </p>
                            )}
                          </div>

                          <Button
                            onClick={handleSubmitAssignment}
                            disabled={!uploadedFile}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                          >
                            Submit Assignment
                          </Button>
                        </>
                      )}

                      <div className="border-t pt-4 mt-4">
                        <p className="text-xs text-gray-600">
                          Due: {new Date(selectedAssignment.dueDate).toLocaleDateString()}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="text-center py-8">
                    <CardContent>
                      <FileText className="w-12 h-12 mx-auto text-gray-300 mb-2" />
                      <p className="text-gray-600">Select an assignment to submit</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </>
        ) : (
          <Card className="text-center py-12">
            <CardContent>
              <p className="text-gray-600">Course not found</p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
