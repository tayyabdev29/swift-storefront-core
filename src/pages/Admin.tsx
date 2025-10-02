import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const Admin = () => {
  const { isAdmin, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAdmin) {
      navigate('/');
    }
  }, [isAdmin, loading, navigate]);

  if (loading) {
    return <div className="container py-20">Loading...</div>;
  }

  return (
    <main className="flex-1 py-12">
      <div className="container">
        <h1 className="font-display text-4xl font-bold mb-8">Admin Dashboard</h1>
        <p className="text-muted-foreground">Admin features coming soon...</p>
      </div>
    </main>
  );
};

export default Admin;
