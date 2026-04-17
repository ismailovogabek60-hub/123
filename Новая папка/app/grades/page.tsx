'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, ChevronLeft, Download } from 'lucide-react';
import Link from 'next/link';

interface Grade {
  id: string;
  courseTitle: string;
  assignmentTitle: string;
  score: number;
  maxScore: number;
  submittedDate: string;
  gradedDate: string;
}

export default function GradesPage() {
  const [grades, setGrades] = useState<Grade[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState<string>('all');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/';
      return;
    }
    fetchGrades(token);
  }, []);

  const fetchGrades = async (token: string) => {
    try {
      const response = await fetch('/api/grades', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setGrades(data.grades || []);
      }
    } catch (error) {
      console.error('Error fetching grades:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const courses = [...new Set(grades.map((g) => g.courseTitle))];
  const filteredGrades =
    selectedCourse === 'all'
      ? grades
      : grades.filter((g) => g.courseTitle === selectedCourse);

  const calculateAverage = (courseTitle?: string) => {
    const relevantGrades = courseTitle
      ? grades.filter((g) => g.courseTitle === courseTitle)
      : grades;
    if (relevantGrades.length === 0) return 0;
    const total = relevantGrades.reduce((sum, g) => sum + (g.score / g.maxScore) * 100, 0);
    return Math.round(total / relevantGrades.length);
  };

  const getGradeColor = (percentage: number) => {
    if (percentage >= 90) return 'text-green-600 bg-green-50';
    if (percentage >= 80) return 'text-blue-600 bg-blue-50';
    if (percentage >= 70) return 'text-yellow-600 bg-yellow-50';
    return 'text-orange-600 bg-orange-50';
  };

  const getGradeLetter = (percentage: number) => {
    if (percentage >= 90) return 'A';
    if (percentage >= 80) return 'B';
    if (percentage >= 70) return 'C';
    if (percentage >= 60) return 'D';
    return 'F';
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
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Your Grades</h2>
          <p className="text-gray-600">Review all your assignment grades and performance</p>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading grades...</p>
          </div>
        ) : grades.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <p className="text-gray-600 text-lg">No grades yet</p>
              <p className="text-gray-500 text-sm mt-1">Your grades will appear here once assignments are graded</p>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Overall Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Overall Average</CardTitle>
                  <CardDescription>Across all courses</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-blue-600">
                    {calculateAverage()}%
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    Grade: {getGradeLetter(calculateAverage())}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Total Assignments</CardTitle>
                  <CardDescription>Graded submissions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-indigo-600">
                    {grades.length}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Courses</CardTitle>
                  <CardDescription>Enrolled courses</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-purple-600">
                    {courses.length}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Course Filter */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-lg">Filter by Course</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Button
                    onClick={() => setSelectedCourse('all')}
                    variant={selectedCourse === 'all' ? 'default' : 'outline'}
                    className={selectedCourse === 'all' ? 'bg-blue-600 hover:bg-blue-700' : ''}
                  >
                    All Courses
                  </Button>
                  {courses.map((course) => (
                    <Button
                      key={course}
                      onClick={() => setSelectedCourse(course)}
                      variant={selectedCourse === course ? 'default' : 'outline'}
                      className={selectedCourse === course ? 'bg-blue-600 hover:bg-blue-700' : ''}
                    >
                      {course}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Grades Table */}
            <Card>
              <CardHeader>
                <CardTitle>
                  {selectedCourse === 'all'
                    ? 'All Grades'
                    : `${selectedCourse} - Average: ${calculateAverage(selectedCourse)}%`}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">
                          Course
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">
                          Assignment
                        </th>
                        <th className="text-center py-3 px-4 font-semibold text-gray-700">
                          Score
                        </th>
                        <th className="text-center py-3 px-4 font-semibold text-gray-700">
                          Grade
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">
                          Submitted
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredGrades.map((grade) => {
                        const percentage = (grade.score / grade.maxScore) * 100;
                        return (
                          <tr key={grade.id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-3 px-4 text-gray-900 font-medium">
                              {grade.courseTitle}
                            </td>
                            <td className="py-3 px-4 text-gray-700">
                              {grade.assignmentTitle}
                            </td>
                            <td className="py-3 px-4 text-center">
                              <span className="font-semibold text-gray-900">
                                {grade.score}/{grade.maxScore}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-center">
                              <div className={`inline-flex items-center justify-center w-10 h-10 rounded-full font-bold text-sm ${getGradeColor(percentage)}`}>
                                {getGradeLetter(percentage)}
                              </div>
                            </td>
                            <td className="py-3 px-4 text-gray-600 text-sm">
                              {new Date(grade.submittedDate).toLocaleDateString()}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="mt-6 flex justify-end">
                  <Button className="gap-2 bg-blue-600 hover:bg-blue-700 text-white">
                    <Download className="w-4 h-4" />
                    Download Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </main>
    </div>
  );
}
