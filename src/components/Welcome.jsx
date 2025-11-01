import { useState } from 'react';
import PropTypes from 'prop-types';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { 
  Wine, 
  Calendar, 
  BarChart3, 
  FileText, 
  ArrowRight,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

const Welcome = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: "¡Bienvenido a Vinísima! 🍷",
      description: "El sistema completo para gestión profesional de catas de vino",
      icon: <Wine className="w-16 h-16 text-red-600" />,
      features: [
        "Gestión completa de muestras de vino",
        "Organización de tandas de cata",
        "Sistema de evaluación profesional",
        "Estadísticas y reportes detallados"
      ]
    },
    {
      title: "Organiza tus Muestras",
      description: "Registra y gestiona todas tus muestras de vino de forma eficiente",
      icon: <FileText className="w-16 h-16 text-blue-600" />,
      features: [
        "Registro detallado de cada muestra",
        "Información de bodega, denominación y cosecha",
        "Estados: Pendiente, En Cata, Catada",
        "Notas y observaciones personalizadas"
      ]
    },
    {
      title: "Programa tus Tandas",
      description: "Organiza sesiones de cata con calendarios y participantes",
      icon: <Calendar className="w-16 h-16 text-green-600" />,
      features: [
        "Programación de fechas y horarios",
        "Gestión de participantes",
        "Diferentes tipos de cata",
        "Control de estados y ubicaciones"
      ]
    },
    {
      title: "Evalúa Profesionalmente",
      description: "Sistema completo de evaluación sensorial especializado",
      icon: <BarChart3 className="w-16 h-16 text-purple-600" />,
      features: [
        "Evaluación visual, olfativa y gustativa",
        "Escalas de puntuación profesionales",
        "Sistema específico para espirituosos",
        "Comentarios y recomendaciones"
      ]
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  const currentStepData = steps[currentStep];

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-red-800 to-red-700 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl animate-in fade-in-0 slide-in-from-bottom-4 duration-700">
        <Card className="shadow-2xl border-0 backdrop-blur-sm bg-white/95">
          <CardHeader className="text-center pb-6 pt-8">
            {/* Indicador de progreso */}
            <div className="flex justify-center gap-2 mb-6">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index <= currentStep 
                      ? 'bg-red-600 scale-110' 
                      : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>

            {/* Icono animado */}
            <div className="mx-auto mb-6 w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center shadow-lg animate-in zoom-in-0 duration-500">
              {currentStepData.icon}
            </div>
            
            <CardTitle className="text-3xl font-bold text-gray-900 mb-3">
              {currentStepData.title}
            </CardTitle>
            
            <CardDescription className="text-gray-600 text-lg max-w-lg mx-auto">
              {currentStepData.description}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="px-8 pb-8">
            {/* Características */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {currentStepData.features.map((feature, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg animate-in slide-in-from-left-2 duration-300"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span className="text-gray-700 text-sm">
                    {feature}
                  </span>
                </div>
              ))}
            </div>

            {/* Botones de acción */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
              <Button
                variant="ghost"
                onClick={handleSkip}
                className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                Saltar tutorial
              </Button>
              
              <div className="flex gap-3">
                {currentStep > 0 && (
                  <Button
                    variant="outline"
                    onClick={() => setCurrentStep(currentStep - 1)}
                    className="border-red-300 text-red-700 hover:bg-red-50"
                  >
                    Anterior
                  </Button>
                )}
                
                <Button
                  onClick={handleNext}
                  className="bg-red-700 hover:bg-red-800 text-white font-semibold px-6 transition-all duration-200 transform hover:scale-105"
                >
                  {currentStep === steps.length - 1 ? (
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      <span>¡Comenzar!</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span>Siguiente</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  )}
                </Button>
              </div>
            </div>

            {/* Información adicional */}
            {currentStep === steps.length - 1 && (
              <div className="mt-8 p-4 bg-gradient-to-r from-red-50 to-red-100 rounded-lg border border-red-200 animate-in slide-in-from-bottom-2 duration-500">
                <div className="text-center text-red-800">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Sparkles className="w-5 h-5" />
                    <span className="font-semibold">¡Todo listo!</span>
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <p className="text-sm">
                    Tu sistema Vinísima está configurado y listo para usar. 
                    Puedes comenzar creando tu primera muestra o programando una tanda de cata.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

Welcome.propTypes = {
  onComplete: PropTypes.func.isRequired,
};

export default Welcome;