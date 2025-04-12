
import React from 'react';
import Header from '@/components/Header';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';

// NGO data
const ngoList = [
  {
    id: 1,
    name: "Goonj",
    description: "Goonj works on disaster relief, humanitarian aid and community development in rural areas across India.",
    website: "https://goonj.org/",
    logo: "/placeholder.svg" 
  },
  {
    id: 2,
    name: "HelpAge India",
    description: "HelpAge India works for the cause and care of disadvantaged older persons to improve their quality of life.",
    website: "https://www.helpageindia.org/",
    logo: "/placeholder.svg"
  },
  {
    id: 3,
    name: "CRY (Child Rights and You)",
    description: "CRY works towards ensuring happy, healthy and creative childhoods for underprivileged children.",
    website: "https://www.cry.org/",
    logo: "/placeholder.svg"
  },
  {
    id: 4,
    name: "Smile Foundation",
    description: "Smile Foundation works for the welfare of children, their families and communities through health, education and livelihood programs.",
    website: "https://www.smilefoundationindia.org/",
    logo: "/placeholder.svg"
  },
  {
    id: 5,
    name: "Akshaya Patra Foundation",
    description: "The Akshaya Patra Foundation works to eliminate classroom hunger by providing mid-day meals to government school children.",
    website: "https://www.akshayapatra.org/",
    logo: "/placeholder.svg"
  }
];

const DonationPage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      
      <main className="flex-1 container py-8">
        <h1 className="text-2xl font-bold mb-6">Donate to Make a Difference</h1>
        
        <div className="bg-blue-50 p-4 rounded-lg mb-8">
          <p className="text-blue-800">
            NSS encourages contributing to reputable NGOs working for social causes. 
            Below is a curated list of organizations you can consider supporting.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ngoList.map(ngo => (
            <Card key={ngo.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="h-14 w-14 mb-2">
                  <img src={ngo.logo} alt={ngo.name} className="h-full w-full object-contain" />
                </div>
                <CardTitle>{ngo.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-700 min-h-[80px]">
                  {ngo.description}
                </CardDescription>
              </CardContent>
              <CardFooter>
                <Button asChild variant="outline" className="w-full">
                  <a href={ngo.website} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2">
                    Visit Website <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default DonationPage;
