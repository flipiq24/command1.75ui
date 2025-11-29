import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Layout from "@/components/Layout";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import DailyOutreach from "@/pages/DailyOutreach";
import PIQ from "@/pages/PIQ";
import MyStats from "@/pages/MyStats";
import Agent from "@/pages/Agent";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/daily-outreach" component={DailyOutreach} />
      <Route path="/piq" component={PIQ} />
      <Route path="/piq/:id" component={PIQ} />
      <Route path="/agent/:id" component={Agent} />
      <Route path="/my-stats" component={MyStats} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Layout>
          <Router />
        </Layout>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
