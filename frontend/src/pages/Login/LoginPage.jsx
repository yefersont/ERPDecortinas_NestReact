import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Loader from '../../components/Loader';
import { useTheme } from '../../context/ThemeContext';
import { Eye, EyeOff, LogIn, Lock, Mail } from 'lucide-react';
import { motion } from 'framer-motion';


export default function LoginPage() {
  const { login } = useAuth();
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const [showSuccessLoader, setShowSuccessLoader] = useState(false);
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(formData.email, formData.password);

    if (!result.success) {
      setError(result.message);
      setLoading(false);
    } else {
      // Login exitoso
      setShowSuccessLoader(true);
      setTimeout(() => {
        navigate('/');
      }, 200); // Esperar 2 segundos
    }
  };



return showSuccessLoader ?
    <Loader text="Iniciando sesión..." /> :
    (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 via-white to-blue-50">
      
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden z-0 pointer-events-none">
        <motion.div 
          className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full blur-[120px] opacity-20 bg-blue-400"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute top-[40%] right-[10%] w-[30%] h-[30%] rounded-full blur-[120px] opacity-20 bg-cyan-400"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.25, 0.2],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
        <motion.div 
          className="absolute -bottom-[10%] left-[20%] w-[35%] h-[35%] rounded-full blur-[120px] opacity-20 bg-blue-500"
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.2, 0.28, 0.2],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
      </div>

      <motion.div 
        className="relative z-10 w-full max-w-md p-8 rounded-2xl shadow-2xl backdrop-blur-sm border bg-white/95 border-blue-100/50"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-500">
            Bienvenido
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Ingresa tus credenciales para continuar
          </p>
        </motion.div>

        <div className="space-y-6">
          {error && (
            <motion.div 
              className="p-3 rounded-lg text-sm border bg-red-50 border-red-100 text-red-600"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              {error}
            </motion.div>
          )}

          <motion.div 
            className="space-y-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <label className="text-sm font-medium text-gray-700">
              Correo Electrónico
            </label>
            <div className="relative group">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors text-gray-400 group-focus-within:text-blue-600" />
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="ejemplo@correo.com"
                className="w-full pl-10 pr-4 py-3 rounded-xl border outline-none transition-all duration-300 bg-gray-50 border-gray-200 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 text-gray-900 placeholder-gray-400"
              />
            </div>
          </motion.div>

          <motion.div 
            className="space-y-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <label className="text-sm font-medium text-gray-700">
              Contraseña
            </label>
            <div className="relative group">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors text-gray-400 group-focus-within:text-blue-600" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full pl-10 pr-12 py-3 rounded-xl border outline-none transition-all duration-300 bg-gray-50 border-gray-200 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 text-gray-900 placeholder-gray-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg transition-colors text-gray-400 hover:text-blue-600 hover:bg-blue-50"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </motion.div>

          <motion.button
            onClick={handleSubmit}
            disabled={loading}
            className={`
              w-full py-3.5 rounded-xl font-semibold shadow-lg transition-all duration-300
              bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white
              ${loading ? 'opacity-70 cursor-wait' : 'hover:shadow-blue-500/30 hover:shadow-xl'}
            `}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Iniciando sesión...
              </span>
            ) : (
              'Iniciar Sesión'
            )}
          </motion.button>

        </div>

        <motion.div 
          className="mt-6 text-center text-sm text-gray-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          ¿Olvidaste tu contraseña?{' '}
          <a href="#" className="font-medium text-blue-600 hover:text-blue-700 hover:underline transition-colors">
            Recuperar acceso
          </a>
        </motion.div>
      </motion.div>
    </div>
  );
}
