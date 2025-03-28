
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowRight, Wallet, LineChart, PiggyBank } from "lucide-react";

const Landing = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="w-full py-4 px-6 flex items-center justify-between">
        <div className="flex items-center">
          <span className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-purple-700 bg-clip-text text-transparent">Union</span>
        </div>
        <div className="flex gap-4">
          <Button variant="ghost" asChild>
            <Link to="/login">Login</Link>
          </Button>
          <Button className="finance-gradient">
            <Link to="/register">Sign Up</Link>
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-1 px-6 py-12 md:py-20 flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto">
        <div className="md:w-1/2 space-y-6">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground">
            Finance for the{" "}
            <span className="bg-gradient-to-r from-purple-500 to-purple-700 bg-clip-text text-transparent">
              new generation
            </span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-lg">
            Track expenses, save money, and achieve your financial goals with Union's modern tools built for today's generation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" className="finance-gradient group">
              <Link to="/dashboard" className="flex items-center">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button size="lg" variant="outline">
              <Link to="/about">Learn More</Link>
            </Button>
          </div>
        </div>
        <div className="md:w-1/2 mt-12 md:mt-0 flex justify-center">
          <div className="relative">
            <div className="absolute -z-10 w-64 h-64 blur-3xl bg-purple-400/20 rounded-full top-10 -left-10"></div>
            <div className="relative animate-float">
              <img 
                src="/lovable-uploads/3ce8e48f-8666-40f0-9a95-9d6f0030cbd3.png" 
                alt="Person celebrating financial success" 
                className="w-full max-w-md" 
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="px-6 py-16 bg-gradient-to-b from-background to-purple-50 dark:from-background dark:to-purple-950/20">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Take control of your <span className="bg-gradient-to-r from-purple-500 to-purple-700 bg-clip-text text-transparent">finances</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-card p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-4">
                <Wallet className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Easy Tracking</h3>
              <p className="text-muted-foreground">Easily track your daily expenses and income with our intuitive interface.</p>
            </div>
            
            <div className="bg-white dark:bg-card p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-4">
                <LineChart className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Visual Insights</h3>
              <p className="text-muted-foreground">Get clear visual insights about your spending habits and financial trends.</p>
            </div>
            
            <div className="bg-white dark:bg-card p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-4">
                <PiggyBank className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Smart Savings</h3>
              <p className="text-muted-foreground">Set savings goals and get personalized suggestions to reach them faster.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* App Preview Section */}
      <section className="px-6 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2 space-y-6">
              <h2 className="text-3xl font-bold">
                Designed for <span className="bg-gradient-to-r from-purple-500 to-purple-700 bg-clip-text text-transparent">modern life</span>
              </h2>
              <p className="text-lg text-muted-foreground">
                Our app is designed to fit seamlessly into your lifestyle, making financial management effortless and even enjoyable.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mr-3 mt-1">
                    <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span>Quick expense entry with receipt scanning</span>
                </li>
                <li className="flex items-start">
                  <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mr-3 mt-1">
                    <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span>Customizable categories for your unique needs</span>
                </li>
                <li className="flex items-start">
                  <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mr-3 mt-1">
                    <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span>Smart notifications to keep you on track</span>
                </li>
              </ul>
              <Button className="finance-gradient mt-4">
                <Link to="/dashboard">Try Now</Link>
              </Button>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="relative">
                <div className="absolute -z-10 w-72 h-72 blur-3xl bg-purple-400/20 rounded-full top-10 -right-10"></div>
                <img 
                  src="/lovable-uploads/95d1543a-832d-47bb-871e-8265f59d3ffb.png" 
                  alt="Person using financial app" 
                  className="w-full max-w-md" 
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonial section */}
      <section className="px-6 py-16 bg-gradient-to-b from-background to-purple-50 dark:from-background dark:to-purple-950/20">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-12">What our users say</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-card p-6 rounded-xl shadow-md">
              <div className="flex justify-center mb-4">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="h-5 w-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-muted-foreground mb-4">"Union has completely changed how I think about money. It's the first budget app I've actually stuck with!"</p>
              <p className="font-medium">- Alex, Student</p>
            </div>
            
            <div className="bg-white dark:bg-card p-6 rounded-xl shadow-md">
              <div className="flex justify-center mb-4">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="h-5 w-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-muted-foreground mb-4">"The visualizations make it so easy to see where my money goes. I've saved more in 3 months than I did all last year!"</p>
              <p className="font-medium">- Taylor, Designer</p>
            </div>
            
            <div className="bg-white dark:bg-card p-6 rounded-xl shadow-md">
              <div className="flex justify-center mb-4">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="h-5 w-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-muted-foreground mb-4">"Finally, a finance app that doesn't make me feel guilty about my spending. The goal-setting feature is amazing!"</p>
              <p className="font-medium">- Jamie, Freelancer</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="px-6 py-8 bg-purple-900 text-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <span className="text-xl font-bold">Union</span>
            <p className="text-purple-200 text-sm">Finance for the new generation</p>
          </div>
          <div className="flex gap-6">
            <Link to="/about" className="text-purple-200 hover:text-white">About</Link>
            <Link to="/contact" className="text-purple-200 hover:text-white">Contact</Link>
            <Link to="/privacy" className="text-purple-200 hover:text-white">Privacy</Link>
            <Link to="/terms" className="text-purple-200 hover:text-white">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
