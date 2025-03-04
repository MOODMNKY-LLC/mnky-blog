'use client'

import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { checkRoles } from '@/app/actions/check-roles'

export function CheckRolesButton() {
  const { toast } = useToast()

  const handleCheckRoles = async () => {
    try {
      const result = await checkRoles()
      
      if (result.error) {
        toast({
          variant: "destructive",
          title: "Error checking roles",
          description: result.error
        })
        return
      }

      toast({
        title: "Current Role",
        description: (
          <div className="mt-2 space-y-1">
            <p><strong>Role:</strong> {result.role}</p>
          </div>
        )
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error checking roles",
        description: error instanceof Error ? error.message : "An error occurred"
      })
    }
  }

  return (
    <Button onClick={handleCheckRoles}>
      Check Roles
    </Button>
  )
} 