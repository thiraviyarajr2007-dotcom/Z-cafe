'use client';

import React, { useState } from 'react';
import { useCartStore } from '@/store/useCartStore';
import { X, User, GraduationCap, Phone, Mail, Lock, Sparkles, CheckCircle2 } from 'lucide-react';
import { StudentUser } from '@/types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { studentUser, setStudentUser } = useCartStore();
  const [isLoginMode, setIsLoginMode] = useState(false);

  // Form states
  const [fullName, setFullName] = useState(studentUser?.fullName || 'Paranitharan');
  const [collegeDepartment, setCollegeDepartment] = useState(studentUser?.collegeDepartment || 'Computer Science & Engg');
  const [studentId, setStudentId] = useState(studentUser?.studentId || 'RATH2024CS042');
  const [mobileNumber, setMobileNumber] = useState(studentUser?.mobileNumber || '9876543210');
  const [email, setEmail] = useState(studentUser?.email || 'parani.cs24@rathinam.ac.in');
  const [password, setPassword] = useState('pass123');
  const [toast, setToast] = useState('');

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const user: StudentUser = {
      id: `std-${Date.now().toString().slice(-4)}`,
      fullName: fullName.trim() || 'Student',
      collegeDepartment: collegeDepartment.trim() || 'General Department',
      studentId: studentId.trim().toUpperCase() || 'STU101',
      mobileNumber: mobileNumber.trim() || '9876543210',
      email: email.trim() || 'student@campus.ac.in',
    };
    setStudentUser(user);
    setToast(isLoginMode ? 'Logged in successfully!' : 'Student account created!');
    setTimeout(() => {
      setToast('');
      onClose();
    }, 800);
  };

  const handleQuickDemoStudent = () => {
    const demo: StudentUser = {
      id: 'std-104',
      fullName: 'Paranitharan',
      collegeDepartment: 'Computer Science & Engg (3rd Yr)',
      studentId: 'RATH2024CS042',
      mobileNumber: '9876543210',
      email: 'parani.cs24@rathinam.ac.in',
    };
    setStudentUser(demo);
    setToast('Switched to Demo Student (Paranitharan)');
    setTimeout(() => {
      setToast('');
      onClose();
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-md rounded-3xl bg-gradient-to-b from-[#2a111a] to-[#120A0C] border border-[#F7B52C]/30 p-6 sm:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.85)] text-[#FFF8EE]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-[#FFF8EE] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <span className="px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-[#F7B52C]/20 text-[#F7B52C] border border-[#F7B52C]/30">
            Campus Student Pass
          </span>
          <h3 className="text-2xl font-black mt-2 text-[#FFF8EE]">
            {isLoginMode ? 'Student Login' : 'Join ZCafe Pre-Order'}
          </h3>
          <p className="text-xs text-[#FFF8EE]/70 mt-1">
            Skip the 20-min college break counter crowd. Order ahead.
          </p>
        </div>

        {/* Quick Demo Switcher */}
        <div className="mb-5 p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-[#F7B52C]">Instant Demo Mode</div>
            <div className="text-[11px] text-white/60">Load student Paranitharan</div>
          </div>
          <button
            type="button"
            onClick={handleQuickDemoStudent}
            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-[#F7B52C] text-[#120A0C] hover:brightness-110 transition-all shadow-md"
          >
            1-Click Demo
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-3.5">
          {!isLoginMode && (
            <>
              <div>
                <label className="block text-[11px] font-bold uppercase text-white/70 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#F7B52C] absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g., Paranitharan"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#F7B52C]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-white/70 mb-1">
                    Student ID
                  </label>
                  <div className="relative">
                    <GraduationCap className="w-4 h-4 text-[#F7B52C] absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      value={studentId}
                      onChange={(e) => setStudentId(e.target.value)}
                      placeholder="RATH2024CS042"
                      className="w-full pl-9 pr-2 py-2.5 rounded-xl bg-white/5 border border-white/15 text-xs font-mono text-white placeholder-white/30 focus:outline-none focus:border-[#F7B52C]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-white/70 mb-1">
                    Department
                  </label>
                  <input
                    type="text"
                    required
                    value={collegeDepartment}
                    onChange={(e) => setCollegeDepartment(e.target.value)}
                    placeholder="CSE / ECE / Mech"
                    className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/15 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#F7B52C]"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-[11px] font-bold uppercase text-white/70 mb-1">
              Mobile Number (For WhatsApp QR)
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-[#F7B52C] absolute left-3.5 top-3" />
              <input
                type="tel"
                required
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                placeholder="10-digit mobile"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#F7B52C]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase text-white/70 mb-1">
              Campus Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#F7B52C] absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@rathinam.ac.in"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#F7B52C]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase text-white/70 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#F7B52C] absolute left-3.5 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#F7B52C]"
              />
            </div>
          </div>

          {toast && (
            <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-bold text-center flex items-center justify-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>{toast}</span>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3.5 px-4 rounded-2xl font-extrabold text-sm bg-gradient-to-r from-[#F7B52C] to-[#FF9F1C] text-[#120A0C] shadow-[0_10px_25px_rgba(247,181,44,0.35)] hover:brightness-110 active:scale-[0.98] transition-all"
          >
            {isLoginMode ? 'Sign In to Campus Pass' : 'Complete Registration'}
          </button>
        </form>

        {/* Toggle mode */}
        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => setIsLoginMode(!isLoginMode)}
            className="text-xs text-white/60 hover:text-[#F7B52C] transition-colors underline"
          >
            {isLoginMode
              ? "Don't have an account? Sign up"
              : 'Already have an account? Sign In'}
          </button>
        </div>
      </div>
    </div>
  );
}
