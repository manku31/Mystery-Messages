"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Separator } from "@/components/ui/separator";
import messages from "@/messages.json";
import Autoplay from "embla-carousel-autoplay";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow flex flex-col items-center justify-center px-4 md:px-24 py-12">
        <section className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-5xl font-bold">
            Dive into the world of anonymous conversation
          </h1>
          <p className="mt-3 md:mt-4 text-base md:text-lg">
            Explore mystery messages - where your identity remains a secret.
          </p>
        </section>

        <Carousel
          className="w-full max-w-2xl"
          plugins={[Autoplay({ delay: 2000 })]}
        >
          <CarouselContent className="">
            {messages.map((message, index) => (
              <CarouselItem key={index}>
                <div className="p-1">
                  <Card>
                    <CardHeader className="font-semibold text-lg">
                      {message.title}
                    </CardHeader>
                    <CardContent className="flex p-6 h-32 max-w-2xl">
                      <span className="text-2xl">
                        <p className="font-semibold">Message : </p>
                        {message.content}
                      </span>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </main>

      <footer className="text-center p-4 md:p-10">
        <Separator />
        <p className="mt-5">@ 2024 Mystery Message. All rights reserved.</p>
      </footer>
    </div>
  );
}
